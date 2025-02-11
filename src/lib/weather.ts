import { addParams, toUTC } from '$lib';
import { error } from '@sveltejs/kit';
import { greatCircle } from '@turf/turf';

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

export async function getWeather(
	start: [number, number],
	end: [number, number],
	time: Date
): Promise<Weather[]> {
	const coords = greatCircle(start, end, { npoints: 10 }).geometry.coordinates;
	const weatherData = await Promise.all(
		coords.map((coord) =>
			getWeatherData(time, coord[0].valueOf() as number, coord[1].valueOf() as number)
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
		wind_direction: hourlyData.wind_direction_180m[hourlyIndex]
	};
}
