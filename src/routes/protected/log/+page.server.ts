import { addParams } from '$lib';
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
export async function load({ locals: { supabase, user } }) {
	const { data: aircrafts, error: e } = await supabase
		.from('aircrafts')
		.select()
		.eq('owner', user?.id);
	if (e) error(500, { message: e.message });
	// Temporary error redirect to avoid user without aircrafts
	if (aircrafts.length == 0) error(400, { message: 'No aircrafts registered' });
	return { aircrafts: aircrafts as Aircraft[] };
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		console.log(formData);
		const depICAO = await getAirportData(formData.get('dep_airport') as string).then(
			(val) => val.icao
		);
		const desICAO = await getAirportData(formData.get('des_airport') as string).then(
			(val) => val.icao
		);
		formData.set('dep_airport', depICAO);
		formData.set('des_airport', desICAO);
		numToNull(formData, 'fuel_usage');
		numToNull(formData, 'altitude');
		const obj = Object.fromEntries(formData.entries());
		const { error: e } = await supabase.from('logs').insert(obj);
		if (e) error(500, { message: e.message });
	}
};

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
