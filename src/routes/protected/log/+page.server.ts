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
		const dep = formData.get('dep_airport') as string;
		const des = formData.get('des_airport') as string;
		const depICAO = await getAirportData(dep).then((val) => val.icao);
		const desICAO = await getAirportData(des).then((val) => val.icao);
		formData.set('dep_airport', depICAO);
		formData.set('des_airport', desICAO);
	}
};
async function getAirportData(code: string): Promise<AirportInfo> {
	const length: number = code.length;
	if (length < 3 || length > 4) error(422, { message: 'Invalid airport code' });
	const param: string = length == 4 ? 'icao' : 'iata';
	const url: string = addParams(apiUrl, { [param]: code });
	const response: Response = await fetch(url);
	if (!response.ok) error(response.status, { message: response.statusText });
	const json: AirportInfo = await response.json();
	if (!json['country']) error(422, { message: 'Invalid airport code' });
	return json;
}
