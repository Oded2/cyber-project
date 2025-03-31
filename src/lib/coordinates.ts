import { booleanPointInPolygon, greatCircle, point } from '@turf/turf';
import type { Feature, LineString, MultiLineString, Polygon, Position } from 'geojson';

const fetchCountries: (fetchFn?: typeof fetch) => Promise<CountryGeoJSON> = async (
	fetchFn = fetch
) => {
	// Helper function that fetches the countries geojson file and returns them as the correct type
	// 'fetchFn' allows to use event.fetch for server-side functions
	return (await fetchFn('/countries.geojson').then((response) =>
		response.json()
	)) as Promise<CountryGeoJSON>;
};

const buildGreatCircleRoute: (pointA: Position, pointB: Position) => Position[] = (
	pointA,
	pointB
) => {
	const sanitizeCoordinates: (points: Feature<LineString | MultiLineString>) => Position[] = (
		points
	) => {
		// Converts the output functions such as greatCircle to Position[]
		const geometry = points.geometry;
		if (geometry.type === 'MultiLineString')
			return geometry.coordinates.flat().map((val) => [val[0], val[1]]);
		return geometry.coordinates.map((val) => [val[0], val[1]]);
	};
	return sanitizeCoordinates(greatCircle(pointA, pointB, { npoints: 100 }));
};

export async function buildRoute(
	pointA: Position,
	pointB: Position,
	banned: string[],
	fetchFn?: typeof fetch
): Promise<Position[]> {
	// TODO: Needs to build a route based on banned countries
	const countryData = await fetchCountries(fetchFn);
	const bannedCountriesPolygons = countryData.features.filter((val) =>
		banned.includes(val.properties.ISO_A2)
	);
	return avoidPolygons(pointA, pointB, bannedCountriesPolygons);
}

function avoidPolygons(pointA: Position, pointB: Position, polygons: CountryFeature[]): Position[] {
	const finalPoints: Position[] = [pointA];
	let points: Position[] = buildGreatCircleRoute(pointA, pointB);
	const MAXCALLCOUNT = 10000;
	// If the while loop gets called over 10,000 times, the site will throw an error in order to avoid
	// a crash
	let callCount = 0;
	while (
		haversineDistance(finalPoints[finalPoints.length - 1], pointB) > 1 &&
		callCount < MAXCALLCOUNT
	) {
		callCount++;
		for (const point of points) {
			const illegal = illegalPoint(point, polygons);
			if (illegal) {
				const closestLegal = binarySearchCoordinates(point, polygons);
				const test = buildGreatCircleRoute(finalPoints[finalPoints.length - 1], closestLegal);
				finalPoints.push(...test);
				break;
			} else {
				finalPoints.push(point);
			}
		}
		const lastPoint = finalPoints[finalPoints.length - 1];
		points = buildGreatCircleRoute(lastPoint, pointB);
	}
	if (callCount === MAXCALLCOUNT) console.error('Max calls exceeded');
	return finalPoints;
}

function binarySearchCoordinates(
	illegalCoordinate: Position,
	polygons: CountryFeature[]
): Position {
	// An illegal coordinate has been found
	let down: Position = illegalCoordinate;
	let up: Position = illegalCoordinate;
	const shiftCoord: (point: Position, dir: 'up' | 'down') => Position = (point, dir) => {
		const toAdd = dir === 'up' ? 1 : -1;
		return [point[0], point[1] + toAdd];
	};
	while (illegalPoint(down, polygons) && illegalPoint(up, polygons)) {
		up = shiftCoord(up, 'up');
		down = shiftCoord(down, 'down');
	}
	return illegalPoint(up, polygons) ? down : up;
}

function illegalPoint(point: Position, polygons: CountryFeature[]): boolean {
	return polygons.some((polygon) => booleanPointInPolygon(point, polygon));
}

export async function getCountriesFlownOver(
	coordinatesPromise: Promise<Position[]>
): Promise<Set<string>> {
	// Function to determine which countries a path flies over
	// Await the promise
	const coordinates = await coordinatesPromise;
	const flownOver = new Set<string>();
	const countryData = await fetchCountries();
	for (const coord of coordinates) {
		const countryFeature = countryData.features.find((feature) => {
			return booleanPointInPolygon(point(coord), feature);
		});
		if (countryFeature) flownOver.add(countryFeature.properties.ISO_A2);
	}
	return flownOver;
}

export function haversineDistance(pointA: Position, pointB: Position): number {
	// Mathematical function to calculate the distance between two points
	const earthRadius = 6371; // km
	// Convert latitude and longitude to radians
	const deltaLatitude = ((pointB[1] - pointA[1]) * Math.PI) / 180;
	const deltaLongitude = ((pointB[0] - pointA[0]) * Math.PI) / 180;
	const halfChordLength =
		Math.cos((pointA[1] * Math.PI) / 180) *
			Math.cos((pointB[1] * Math.PI) / 180) *
			Math.sin(deltaLongitude / 2) *
			Math.sin(deltaLongitude / 2) +
		Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2);

	const angularDistance =
		2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

	return earthRadius * angularDistance;
}

type CountryFeature = {
	type: 'Feature';
	properties: {
		NAME: string; // Country name
		ISO_A2: string; // 2-letter ISO code
		ISO_A3?: string; // 3-letter ISO code (optional)
		POP_EST?: number; // Population estimate (optional)
		CONTINENT?: string; // Continent (optional)
		[key: string]: any; // Allow other properties
	};
	geometry: Polygon;
};

type CountryGeoJSON = { type: 'FeatureCollection'; features: CountryFeature[] };
