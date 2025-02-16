import { handleLogs } from '$lib';
import { error } from '@sveltejs/kit';

export async function load({ locals: { supabase, user } }) {
	const { data, error: e } = await supabase.from('logs').select().eq('owner', user!.id);
	if (e) throw error(500, { message: e.message });
	handleLogs(data);
	return { logs: data as Log[] };
}
