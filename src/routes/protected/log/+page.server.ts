import { APININJAS } from '$env/static/private';
import { addParams, hrefs, toUTC } from '$lib';
import { error, redirect, type Actions } from '@sveltejs/kit';

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

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		// Create an admin supabase client
		const formData = await request.formData();
		// Get data for the airports and check that they are real
		const depAirport = await getAirportData(formData.get('dep_airport') as string);
		const desAirport = await getAirportData(formData.get('des_airport') as string);
		const depDate = new Date(formData.get('dep_time') as string);
		const desDate = new Date(formData.get('des_time') as string);
		validateDates(depDate, desDate);
		numToNull(formData, 'fuel_usage');
		numToNull(formData, 'altitude');
		const obj = Object.fromEntries(formData.entries()) as { [key: string]: any };
		obj['dep_weather'] = await getWeatherData(depDate, depAirport.longitude, depAirport.latitude);
		obj['des_weather'] = await getWeatherData(desDate, desAirport.longitude, desAirport.latitude);
		obj['dep_airport'] = depAirport;
		obj['des_airport'] = desAirport;
		const { error: e } = await supabase.from('logs').insert(obj);
		if (e) error(500, { message: e.message });
		redirect(303, hrefs.logbook);
	}
};

function validateDates(dep: Date, des: Date): void {
	// Ensures that the dates are not the same and that the takeoff happened before the landing
	const difference: number = des.getTime() - dep.getTime();
	if (difference <= 0) error(422, { message: 'Invalid dates' });
}

function numToNull(form: FormData, name: string): void {
	// Some inputs that are numbers are allowed to be null
	// This function deletes the value of the empty numbers in order to pass
	// a null value to supabase
	const val = form.get(name) as string;
	if (val.length == 0) form.delete(name);
}

async function getAirportData(code: string): Promise<Airport> {
	// Returns a type AirportInfo based on an ICAO/IATA code
	// If the code is invalid the function returns an error
	const apiUrl = 'https://api.api-ninjas.com/v1/airports';
	const length: number = code.length;
	if (length < 3 || length > 4) error(422, { message: 'Invalid airport code' });
	const param: string = length == 4 ? 'icao' : 'iata';
	const url: string = addParams(apiUrl, { [param]: code });
	const response: Response = await fetch(url, { headers: { 'X-Api-Key': APININJAS } });
	if (!response.ok) error(response.status, { message: response.statusText });
	const json: any[] = await response.json();
	if (json.length == 0) error(422, { message: `API could not fetch airport code ${code}` });
	return json[0] as Airport;
}

async function getWeatherData(time: Date, long: string, lat: string): Promise<Weather> {
	// Retrieves inforamtion about the weather for a specific date
	const apiUrl = 'https://api.open-meteo.com/v1/forecast';
	// Converts the date to UTC to adjust for timezone differences
	const date = toUTC(time).toISOString().split('T')[0];
	const params: Record<string, string> = {
		longitude: long,
		latitude: lat,
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

function oneHourDiff(date1: Date, date2: Date): boolean {
	// Checks that the difference between two dates is less than an hour
	return Math.abs(date1.getTime() - date2.getTime()) < 3600000;
}
