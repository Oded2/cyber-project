import { booleanPointInPolygon, greatCircle, point, distance } from '@turf/turf';
import type { Feature, LineString, MultiLineString, Polygon, Position } from 'geojson';

type Direction = 'horizontal' | 'vertical';

// Fetches country boundaries as GeoJSON
const fetchCountries: (fetchFn?: typeof fetch) => Promise<CountryGeoJSON> = async (
	fetchFn = fetch
) => {
	// Fetches the geojson file and returns it as the correct type
	return (await fetchFn('/countries.geojson').then((response) =>
		response.json()
	)) as Promise<CountryGeoJSON>;
};

// Generates a great-circle route between two points, with 100 intermediate points
const buildGreatCircleRoute: (pointA: Position, pointB: Position) => Position[] = (
	pointA,
	pointB
) => {
	// Converts the geometry from greatCircle into an array of coordinates (Position[])
	const sanitizeCoordinates: (points: Feature<LineString | MultiLineString>) => Position[] = (
		points
	) => {
		const geometry = points.geometry;
		if (geometry.type === 'MultiLineString')
			return geometry.coordinates.flat().map((val) => [val[0], val[1]]);
		return geometry.coordinates.map((val) => [val[0], val[1]]);
	};
	return sanitizeCoordinates(greatCircle(pointA, pointB, { npoints: 100 }));
};

// Builds a route while avoiding banned countries
export async function buildRoute(
	pointA: Position,
	pointB: Position,
	banned: string[],
	fetchFn?: typeof fetch
): Promise<Position[]> {
	// Fetch country data and filter out banned countries
	const countryData = await fetchCountries(fetchFn);
	const bannedCountriesPolygons = countryData.features.filter((val) =>
		banned.includes(val.properties.ISO_A2)
	);
	return avoidPolygons(pointA, pointB, bannedCountriesPolygons); // Call function to avoid banned countries
}

// Adjusts the route to avoid specified polygons (banned countries)
function avoidPolygons(pointA: Position, pointB: Position, polygons: CountryFeature[]): Position[] {
	const finalPoints: Position[] = [pointA]; // Route starts at pointA
	const direction = directionOfRoute(pointA, pointB); // Determine route direction (horizontal/vertical)
	let points: Position[] = buildGreatCircleRoute(pointA, pointB); // Get initial great-circle route
	const MAXCALLCOUNT = 1000; // Prevents infinite loops by limiting the number of attempts
	let callCount = 0;

	// Iteratively adjust the route until we reach the destination or exceed max attempts
	while (
		distance(finalPoints[finalPoints.length - 1], pointB, { units: 'kilometers' }) > 1 &&
		callCount < MAXCALLCOUNT
	) {
		callCount++;
		for (const point of points) {
			const illegal = illegalPoint(point, polygons); // Check if the point is inside a banned country
			if (illegal) {
				// If the point is illegal, find the closest legal point and adjust the route
				const closestLegal = binarySearchCoordinates(point, polygons, direction);
				const test = buildGreatCircleRoute(finalPoints[finalPoints.length - 1], closestLegal);
				finalPoints.push(...test);
				break;
			} else {
				// If point is legal, add it to the route
				finalPoints.push(point);
			}
		}
		// Recalculate points for the next segment of the route
		const lastPoint = finalPoints[finalPoints.length - 1];
		points = buildGreatCircleRoute(lastPoint, pointB);
	}
	if (callCount === MAXCALLCOUNT) console.error('Max calls exceeded'); // Error if too many attempts
	return finalPoints;
}

// Determines if the route is horizontal or vertical based on the angle between the points
function directionOfRoute(pointA: Position, pointB: Position): Direction {
	const deltaLon = pointA[0] - pointB[0];
	const deltaLat = pointA[1] - pointB[1];
	const angle = (Math.atan(deltaLat / deltaLon) * 180) / Math.PI;
	if (-45 <= angle && angle <= 45) return 'horizontal'; // Route is horizontal if the angle is between -45 and 45
	return 'vertical'; // Otherwise, it's vertical
}

// Finds the closest valid coordinate if the current one is inside a banned polygon
function binarySearchCoordinates(
	illegalCoordinate: Position,
	polygons: CountryFeature[],
	direction: Direction
): Position {
	let downOrLeft: Position = illegalCoordinate; // The point to move down/left
	let upOrRight: Position = illegalCoordinate; // The point to move up/right
	const shiftCoord: (point: Position, isPositive: boolean) => Position = (point, isPositive) => {
		const toAdd = isPositive ? 1 : -1;
		// Shift the coordinate either vertically or horizontally based on the direction
		if (direction === 'horizontal') return [point[0], point[1] + toAdd];
		return [point[0] + toAdd, point[1]];
	};
	// Continue adjusting the coordinates until a valid point is found
	while (illegalPoint(downOrLeft, polygons) && illegalPoint(upOrRight, polygons)) {
		upOrRight = shiftCoord(upOrRight, true);
		downOrLeft = shiftCoord(downOrLeft, false);
	}
	// Return the first valid coordinate found
	return illegalPoint(upOrRight, polygons) ? downOrLeft : upOrRight;
}

// Checks if a point is inside any of the banned country polygons
function illegalPoint(point: Position, polygons: CountryFeature[]): boolean {
	return polygons.some((polygon) => booleanPointInPolygon(point, polygon)); // Return true if point is inside a banned polygon
}

// Determines which countries are overflown by a route, based on the coordinates
export async function getCountriesFlownOver(
	coordinatesPromise: Promise<Position[]>
): Promise<Set<string>> {
	const coordinates = await coordinatesPromise; // Await the promise to get coordinates
	const flownOver = new Set<string>(); // Set to store unique country ISO codes
	const countryData = await fetchCountries(); // Fetch country data
	for (const coord of coordinates) {
		// Find which country the coordinate belongs to
		const countryFeature = countryData.features.find((feature) =>
			booleanPointInPolygon(point(coord), feature)
		);
		if (countryFeature) flownOver.add(countryFeature.properties.ISO_A2); // Add country code to the set
	}
	return flownOver; // Return the set of overflown countries
}

// Type definition for a country's geographic data
type CountryFeature = {
	type: 'Feature'; // Feature type for GeoJSON
	properties: {
		NAME: string; // Country name
		ISO_A2: string; // 2-letter ISO code
		ISO_A3?: string; // 3-letter ISO code (optional)
		POP_EST?: number; // Population estimate (optional)
		CONTINENT?: string; // Continent (optional)
		[key: string]: any; // Other properties
	};
	geometry: Polygon; // Geographical shape of the country (Polygon)
};

type CountryGeoJSON = { type: 'FeatureCollection'; features: CountryFeature[] }; // GeoJSON format for country data
