import { APININJAS } from '$env/static/private';
import { addParams, combineDateTime, extractDate, hrefs, maxDate, minDate } from '$lib';
import { buildRoute } from '$lib/coordinates.js';
import { getWeather } from '$lib/weather';
import { error, redirect, type Actions } from '@sveltejs/kit';

export async function load({ url }): Promise<{ predefinedDate: string }> {
	const predefinedDate = url.searchParams.get('date') ?? extractDate();
	return {
		predefinedDate
	};
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user }, fetch }) => {
		if (!user) throw error(401, { message: 'No user found' });
		const today = new Date();
		const formData = await request.formData();
		const depDate = combineDateTime(
			formData.get('date') as string,
			formData.get('dep_time') as string
		);
		const desDate = combineDateTime(
			formData.get('date') as string,
			formData.get('des_time') as string
		);
		if (desDate < depDate) {
			// The user has put the hour of the arrival as before the hour of the departure
			// Therefore it means that the user has landed a day later
			desDate.setDate(desDate.getDate() + 1);
		}
		validateDates(depDate, desDate);
		const { data: profile, error: eP } = await supabase
			.from('profiles')
			.select('bannedCountries')
			.eq('id', user.id)
			.single();
		if (eP) throw error(500, { message: eP.message });
		const bannedCountries = profile.bannedCountries as string[];
		const notes = formData.get('notes') as string;
		// Get data for the airports and check that they are real
		const depAirport = await getAirportData(formData.get('dep_airport') as string);
		const desAirport = await getAirportData(formData.get('des_airport') as string);
		const route = await buildRoute(
			[depAirport.longitude, depAirport.latitude],
			[desAirport.longitude, desAirport.latitude],
			bannedCountries,
			fetch
		);
		numToNull(formData, 'fuel_usage');
		numToNull(formData, 'altitude');
		const obj = Object.fromEntries(formData.entries()) as { [key: string]: any };
		delete obj['date']; // Date was only used to calculate the dep_time and the des_time
		delete obj['fetchWeather']; // Only used to determine if the weather should be fetched or not
		const fetchWeather = formData.get('fetchWeather'); // Determine if the weather should be fetched
		if (fetchWeather && depDate > minDate && desDate < maxDate) {
			// Only fetch the weather if the dates are not out of bounds
			// Get the weather data from the departure airport to the destination airport
			const weather = await getWeather(route, depDate, desDate);
			obj['weather_data'] = weather;
		}
		obj['dep_airport'] = depAirport;
		obj['des_airport'] = desAirport;
		// Ensure that the dates are inserted properly
		obj['dep_time'] = depDate.toISOString();
		obj['des_time'] = desDate.toISOString();
		obj['true_weather'] = desDate < today;
		// Remove any whitespace from the notes
		obj['notes'] = notes.trim();
		obj['points'] = route.flat();
		const { error: e } = await supabase.from('logs').insert(obj);
		if (e) throw error(500, { message: e.message });
		throw redirect(303, hrefs.logbook);
	}
};

function validateDates(dep: Date, des: Date): void {
	// Ensures that the dates are not the same and that the takeoff happened before the landing
	const difference: number = des.getTime() - dep.getTime();
	if (difference <= 0) throw error(422, { message: 'Invalid dates' });
}

function numToNull(form: FormData, name: string): void {
	// Some inputs that are numbers are allowed to be null
	// This function deletes the value of the empty numbers in order to pass a null value to supabase
	const val = form.get(name) as string;
	if (val.length == 0) form.delete(name);
}

async function getAirportData(code: string): Promise<Airport> {
	// Returns a type AirportInfo based on an ICAO/IATA code
	// If the code is invalid the function returns an error
	const apiUrl = 'https://api.api-ninjas.com/v1/airports';
	const length: number = code.length;
	if (length < 3 || length > 4) throw error(422, { message: 'Invalid airport code' });
	// Since the user is able to input both ICAO and IATA codes, this constant
	// checks to see which one the user meant based on length
	const param: string = length == 4 ? 'icao' : 'iata';
	// Builds the API URL
	const url: string = addParams(apiUrl, { [param]: code });
	// Fetches the URL with the API key in the header for authentication
	const response: Response = await fetch(url, { headers: { 'X-Api-Key': APININJAS } });
	// Error handling
	if (!response.ok) throw error(response.status, { message: response.statusText });
	const json: { [key: string]: any }[] = await response.json();
	if (json.length == 0) throw error(422, { message: `API could not fetch airport code ${code}` });
	const airport = json[0];
	// Converts the longitude and latitude coordinates to number
	airport['longitude'] = parseFloat(airport['longitude']);
	airport['latitude'] = parseFloat(airport['latitude']);
	return json[0] as Airport;
}
