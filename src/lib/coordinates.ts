import { booleanPointInPolygon, greatCircle, point } from '@turf/turf';
import type { Feature, Geometry, LineString, MultiLineString, Position } from 'geojson';

export function buildRoute(pointA: Position, pointB: Position): Position[] {
	// TODO: Needs to build a route based on banned countries
	const points = sanitizeCoordinates(greatCircle(pointA, pointB, { npoints: 100 }));
	return points;
}

export function sanitizeCoordinates(points: Feature<LineString | MultiLineString>): Position[] {
	// Converts the output functions such as greatCircle to Position[]
	const geometry = points.geometry;
	if (geometry.type === 'MultiLineString')
		return geometry.coordinates.flat().map((val) => [val[0], val[1]]);
	return geometry.coordinates.map((val) => [val[0], val[1]]);
}

export async function getCountriesFlownOver(coordinates: Position[]): Promise<Set<string>> {
	// Function to determine which countries a path flies over
	const countryData = (await fetch('/countries.geojson').then((response) =>
		response.json()
	)) as CountryGeoJSON;
	const flownOver = new Set<string>();
	for (const coord of coordinates) {
		const countryFeature = countryData.features.find((feature: any) => {
			return booleanPointInPolygon(point(coord), feature);
		});
		if (countryFeature) flownOver.add(countryFeature.properties.ISO_A2 ?? 'ERROR');
	}
	return flownOver;
}

export function haversineDistance(pointA: Coordinate, pointB: Coordinate): number {
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
		ISO_A2?: string; // 2-letter ISO code (optional)
		ISO_A3?: string; // 3-letter ISO code (optional)
		POP_EST?: number; // Population estimate (optional)
		CONTINENT?: string; // Continent (optional)
		[key: string]: any; // Allow other properties
	};
	geometry: Geometry;
};

type CountryGeoJSON = { type: 'FeatureCollection'; features: CountryFeature[] };
