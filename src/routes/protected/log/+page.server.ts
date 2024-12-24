import { SERVICE_ROLE } from '$env/static/private';
import { addParams, createSupabaseClient, hrefs } from '$lib';
import { error, redirect, type Actions } from '@sveltejs/kit';

const apiUrl = 'https://airport-data.com/api/ap_info.json';
type AirportInfo = {
	icao: string;
	iata: string;
	name: string;
	location: string;
	country: string;
	country_code: string;
	longitude: string;
	latitude: string;
	link: string;
	status: number;
};

export const actions: Actions = {
	default: async ({ request, locals: { user } }) => {
		const admin = createSupabaseClient(SERVICE_ROLE);
		const formData = await request.formData();
		const depICAO = await getAirportData(formData.get('dep_airport') as string).then(
			(val) => val.icao
		);
		const desICAO = await getAirportData(formData.get('des_airport') as string).then(
			(val) => val.icao
		);
		// Set the form data as ICAO codes
		formData.set('dep_airport', depICAO);
		formData.set('des_airport', desICAO);
		const depDate = new Date(formData.get('dep_time') as string);
		const desDate = new Date(formData.get('des_time') as string);
		validateDates(depDate, desDate);
		// Set the owner of the log as the user
		formData.set('owner', user!.id);
		numToNull(formData, 'fuel_usage');
		numToNull(formData, 'altitude');
		const obj = Object.fromEntries(formData.entries());
		const { error: e } = await admin.from('logs').insert(obj);
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

async function getAirportData(code: string): Promise<AirportInfo> {
	// Returns a type AirportInfo based on an ICAO/IATA code
	// If the code is invalid the function returns an error
	const length: number = code.length;
	if (length < 3 || length > 4) error(422, { message: 'Invalid airport code' });
	const param: string = length == 4 ? 'icao' : 'iata';
	const url: string = addParams(apiUrl, { [param]: code });
	const response: Response = await fetch(url);
	if (!response.ok) error(response.status, { message: response.statusText });
	const json: AirportInfo = await response.json();
	if (!json['country']) error(422, { message: 'API could not fetch airport code' });
	return json;
}
