type CurrentPage = 'profile' | 'account' | 'logbook' | 'aircraft';
type Aircraft = {
	id: number; // bigint
	created_at: string; // timestamp with time zone
	nickname: string; // text
	tail_number: string; // text
	model: string; // text
	manufacturer: string; // text
	year_of_manufacture: number; // integer
	aircraft_type: string; // text
	category: string; // text
	aircraft_engine: string; // text
	number_of_engines: number; // integer
	maximum_takeoff_weight: number; // integer
	wingspan: number; // integer
	range: number; // integer
	cruising_speed: number; // integer
	fuel_capacity: number; // integer
	fuel_type: string; // text
	owner_name: string; // text
	seating_capacity: number; // integer
	modifications: string; // text
	notes: string; // text
	visibility: 'public' | 'private' | 'unlisted'; // text with constraints
	owner: string; // uuid
};

export async function load({ url, locals: { supabase, user } }) {
	const aircrafts: Aircraft[] = [];
	let { data: temp } = await supabase.from('aircrafts').select().eq('owner', user?.id);
	// If temp is null, it will become an empty array
	temp = temp ?? [];
	for (let i = 0; i < temp.length; i++) aircrafts[i] = temp[i];
	return { page: (url.searchParams.get('page') ?? 'profile') as CurrentPage, aircrafts };
}
