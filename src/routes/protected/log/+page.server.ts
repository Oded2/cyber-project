import { AIRPORTDB_API_KEY } from '$env/static/private';
import { addParams, combineDateTime, extractDate, handleLogs, hrefs, maxDate, minDate } from '$lib';
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
		const depTime = combineDateTime(
			formData.get('date') as string,
			formData.get('dep_time') as string
		);
		const desTime = combineDateTime(
			formData.get('date') as string,
			formData.get('des_time') as string
		);

		// Block the user from creating a flight during times when he already has a flight
		const { data: temp, error: conflictError } = await supabase
			.from('logs')
			.select()
			.eq('owner', user.id);
		if (conflictError) {
			console.error('Error fetching conflicting flights:', conflictError);
			throw error(500, 'Internal server error');
		}

		let allUserFlights = temp as Log[];
		handleLogs(allUserFlights);
		const conflictingFlight = allUserFlights.some(
			(log) => depTime <= log.des_time && log.dep_time <= desTime
		);
		if (conflictingFlight) {
			throw error(409, 'Conflicting flight');
		}
		// Get data for the airports and check that they are real
		const depAirport = await getAirportData(formData.get('dep_airport') as string);
		if (!depAirport)
			return {
				invalidAirport: formData.get('dep_airport')?.toString()
			};
		const desAirport = await getAirportData(formData.get('des_airport') as string);
		if (!desAirport)
			return {
				invalidAirport: formData.get('des_airport')?.toString()
			};
		if (desTime < depTime) {
			// The user has put the hour of the arrival as before the hour of the departure
			// Therefore it means that the user has landed a day later
			desTime.setDate(desTime.getDate() + 1);
		}
		validateDates(depTime, desTime);
		const { data: profile, error: eP } = await supabase
			.from('profiles')
			.select('bannedCountries')
			.eq('id', user.id)
			.single();
		if (eP) throw error(500, { message: eP.message });
		const bannedCountries = profile.bannedCountries as string[];
		const notes = formData.get('notes') as string;
		const route = await buildRoute(
			[depAirport.longitude_deg, depAirport.latitude_deg],
			[desAirport.longitude_deg, desAirport.latitude_deg],
			bannedCountries,
			fetch
		);
		numToNull(formData, 'fuel_usage');
		numToNull(formData, 'altitude');
		const obj = Object.fromEntries(formData.entries()) as { [key: string]: any };
		delete obj['date']; // Date was only used to calculate the dep_time and the des_time
		delete obj['fetchWeather']; // Only used to determine if the weather should be fetched or not
		const fetchWeather = formData.get('fetchWeather'); // Determine if the weather should be fetched
		if (fetchWeather && depTime > minDate && desTime < maxDate) {
			// Only fetch the weather if the dates are not out of bounds
			// Get the weather data from the departure airport to the destination airport
			const weather = await getWeather(route, depTime, desTime);
			obj['weather_data'] = weather;
		}
		obj['dep_airport'] = depAirport;
		obj['des_airport'] = desAirport;
		// Ensure that the dates are inserted properly
		obj['dep_time'] = depTime.toISOString();
		obj['des_time'] = desTime.toISOString();
		obj['true_weather'] = desTime < today;
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

async function getAirportData(code: string): Promise<Airport | null> {
	// Fetches airport data by ICAO code, validates the response, and returns it
	// Validate that the airport code is exactly 4 characters long
	const length: number = code.length;
	if (length !== 4) throw error(422, { message: 'Invalid airport code' });
	// Prepare the API URL with the given ICAO code and API key
	const apiUrl = `https://airportdb.io/api/v1/airport/${code}`;
	const url: string = addParams(apiUrl, { apiToken: AIRPORTDB_API_KEY });
	// Perform the API request
	const response: Response = await fetch(url);
	// Return null if the response isn't ok
	if (!response.ok) return null;
	// Return the airport object, typed as Airport
	return (await response.json()) as Airport;
}
