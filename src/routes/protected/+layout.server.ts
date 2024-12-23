import type { PostgrestError } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

type Profile = {
	id: string;
	created_at: string;
	display: string;
	username: string;
	bio: string;
};

export async function load({ locals: { supabase, user } }) {
	const userId = user!.id;
	const { data: profile, error: e1 } = await supabase.from('profiles').select().eq('id', userId);
	handleError(e1);
	const { data: aircrafts, error: e2 } = await supabase
		.from('aircrafts')
		.select()
		.eq('owner', userId);
	handleError(e2);
	const { data: logs, error: e3 } = await supabase.from('logs').select().eq('owner', userId);
	handleError(e3);
	logs!.forEach((item) => {
		item['dep_time'] = new Date(item['dep_time']);
		item['des_time'] = new Date(item['des_time']);
	});
	return {
		profile: profile![0] as Profile,
		aircrafts: aircrafts as Aircraft[],
		logs: logs as Log[]
	};
}

function handleError(e: PostgrestError | null): void {
	if (e) error(500, { message: e.message });
}
