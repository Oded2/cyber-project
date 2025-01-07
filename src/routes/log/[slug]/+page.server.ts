import { error } from '@sveltejs/kit';

export async function load({ params, locals: { supabase } }) {
	const id: number = parseInt(params.slug);
	if (isNaN(id)) error(400, { message: 'Invalid Log Id' });
	const { data, error: e } = await supabase.from('logs').select().eq('id', id);
	if (e) error(500, { message: e.message });
	const log = data[0];
	log['dep_time'] = new Date(log['dep_time']);
	log['des_time'] = new Date(log['des_time']);
	return { log: log as Log };
}
