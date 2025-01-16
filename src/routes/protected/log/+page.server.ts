import { APININJAS } from '$env/static/private';
import { addParams, hrefs, getWeatherData } from '$lib';
import { error, redirect, type Actions } from '@sveltejs/kit';

export async function load({ parent, url }) {
	const { aircrafts } = await parent();
	const predefinedDate = url.searchParams.get('date');
	if (aircrafts.length == 0) error(400, { message: 'No registered aircrafts' });
	return { predefinedDate: predefinedDate ? new Date(predefinedDate) : new Date() };
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
		// Ensure that the dates are inserted properly
		obj['dep_time'] = depDate.toISOString();
		obj['des_time'] = desDate.toISOString();
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
	// This function deletes the value of the empty numbers in order to pass a null value to supabase
	const val = form.get(name) as string;
	if (val.length == 0) form.delete(name);
}

async function getAirportData(code: string): Promise<Airport> {
	// Returns a type AirportInfo based on an ICAO/IATA code
	// If the code is invalid the function returns an error
	const apiUrl = 'https://api.api-ninjas.com/v1/airports';
	const length: number = code.length;
	if (length < 3 || length > 4) error(422, { message: 'Invalid airport code' });
	// Since the user is able to input both ICAO and IATA codes, this constant
	// checks to see which one the user meant based on length
	const param: string = length == 4 ? 'icao' : 'iata';
	// Builds the API URL
	const url: string = addParams(apiUrl, { [param]: code });
	// Fetches the URL with the API key in the header for authentication
	const response: Response = await fetch(url, { headers: { 'X-Api-Key': APININJAS } });
	// Error handling
	if (!response.ok) error(response.status, { message: response.statusText });
	const json: { [key: string]: any }[] = await response.json();
	if (json.length == 0) error(422, { message: `API could not fetch airport code ${code}` });
	const airport = json[0];
	// Converts the longitude and latitude coordinates to number
	airport['longitude'] = parseFloat(airport['longitude']);
	airport['latitude'] = parseFloat(airport['latitude']);
	return json[0] as Airport;
}
