import { addParams, getDatesBetween, toUTC } from '$lib';
import { error } from '@sveltejs/kit';
import { greatCircle, booleanPointInPolygon, point } from '@turf/turf';

export async function getCountriesFlownOver(
	start: Coordinate,
	end: Coordinate
): Promise<Set<string>> {
	// Function to determine which countries a path flies over
	const countryData = (await fetch('/countries.geojson').then((response) =>
		response.json()
	)) as CountryGeoJSON;
	const pathCoords = greatCircle(start, end, { npoints: 50 }).geometry;
	const flownOver = new Set<string>();
	let arr: Coordinate[];
	if (pathCoords.type === 'MultiLineString')
		arr = pathCoords.coordinates.flat().map((val) => [val[0], val[1]]);
	else arr = pathCoords.coordinates.map((val) => [val[0], val[1]]);
	for (const coord of arr) {
		const countryFeature = countryData.features.find((feature: any) => {
			return booleanPointInPolygon(point(coord), feature);
		});
		if (countryFeature) flownOver.add(countryFeature.properties.NAME);
	}
	return flownOver;
}

export async function getWeather(
	start: Coordinate,
	end: Coordinate,
	timeStart: Date,
	timeEnd: Date
): Promise<Weather[]> {
	const coords = greatCircle(start, end, { npoints: 10 }).geometry.coordinates;
	const dates = getDatesBetween(timeStart, timeEnd, 10);
	const weatherData = await Promise.all(
		coords.map((coord, index) =>
			getWeatherData(dates[index], coord[0].valueOf() as number, coord[1].valueOf() as number)
		)
	);
	return weatherData;
}

export async function getWeatherData(time: Date, long: number, lat: number): Promise<Weather> {
	// Retrieves inforamtion about the weather for a specific date
	const oneHourDiff = (date1: Date, date2: Date): boolean => {
		// Checks that the difference between two dates is less than an hour
		return Math.abs(date1.getTime() - date2.getTime()) < 3600000;
	};
	const apiUrl = 'https://api.open-meteo.com/v1/forecast';
	// Converts the date to UTC to adjust for timezone differences
	const date = toUTC(time).toISOString().split('T')[0];
	const params: Record<string, string> = {
		longitude: long.toString(),
		latitude: lat.toString(),
		hourly:
			'temperature_2m,relative_humidity_2m,dew_point_2m,precipitation,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_180m,wind_direction_180m,temperature_180m',
		wind_speed_unit: 'kn',
		start_date: date,
		end_date: date
	};
	const url: string = addParams(apiUrl, params);
	const response: Response = await fetch(url);
	if (!response.ok) error(response.status, { message: response.statusText });
	const json: WeatherData = (await response.json()) as WeatherData;
	const hourlyData = json.hourly;
	const hourlyIndex = hourlyData.time.findIndex((item) => oneHourDiff(new Date(item), time));
	return {
		temperature: hourlyData.temperature_2m[hourlyIndex],
		dewPoint: hourlyData.dew_point_2m[hourlyIndex],
		humidity: hourlyData.relative_humidity_2m[hourlyIndex],
		precipation: hourlyData.precipitation[hourlyIndex],
		pressure: hourlyData.pressure_msl[hourlyIndex],
		cloud_cover: hourlyData.cloud_cover[hourlyIndex],
		visibility: hourlyData.visibility[hourlyIndex],
		wind_speed: hourlyData.wind_speed_180m[hourlyIndex],
		wind_direction: hourlyData.wind_direction_180m[hourlyIndex],
		coord: [long, lat]
	};
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
	geometry: {
		type: 'Polygon' | 'MultiPolygon'; // Country boundaries
		coordinates: number[][][][]; // GeoJSON coordinates
	};
};

type CountryGeoJSON = { type: 'FeatureCollection'; features: CountryFeature[] };

interface WeatherData {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
	hourly_units: {
		time: string;
		temperature_2m: string;
		relative_humidity_2m: string;
		dew_point_2m: string;
		precipitation: string;
		weather_code: string;
		pressure_msl: string;
		surface_pressure: string;
		cloud_cover: string;
		visibility: string;
		wind_speed_180m: string;
		wind_direction_180m: string;
		temperature_180m: string;
	};
	hourly: {
		time: string[];
		temperature_2m: number[];
		relative_humidity_2m: number[];
		dew_point_2m: number[];
		precipitation: number[];
		weather_code: number[];
		pressure_msl: number[];
		surface_pressure: number[];
		cloud_cover: number[];
		visibility: number[];
		wind_speed_180m: number[];
		wind_direction_180m: number[];
		temperature_180m: number[];
	};
}
