import { error } from '@sveltejs/kit';

type Log = {
	id: number; // bigint
	owner: string; // uuid
	created_at: string; // timestamp with time zone
	dep_time: string; // timestamp with time zone
	des_time: string; // timestamp with time zone
	dep_airport: string; // text
	des_airport: string; // text
	aircraft: number; // bigint (foreign key referencing aircrafts)
	notes: string; // text
	altitude?: number; // integer (optional)
	pilot_in_command: string; // text
	visibility: 'public' | 'unlisted' | 'private'; // text with constraints
	fuel_usage?: number; // bigint (optional)
	rating: 'visual' | 'instrument'; // text with constraints
};

export async function load({ locals: { supabase, user } }) {
	const { data, error: e } = await supabase.from('logs').select().eq('owner', user!.id);
	if (e) error(500, { message: e.message });
	return { logs: data as Log[] };
}
