import { handleLogs } from '$lib';
import { error } from '@sveltejs/kit';

export async function load({ params, url, locals: { supabase } }) {
	const ref = url.searchParams.get('ref') ?? '';
	const id: number = parseInt(params.slug);
	if (isNaN(id)) throw error(400, { message: 'Invalid Log Id' });
	const { data: l, error: eL } = await supabase.from('logs').select().eq('id', id);
	if (eL) throw error(500, { message: eL.message });
	if (l.length == 0) throw error(404, { message: 'Log not found' });
	handleLogs(l);
	const log = l[0];
	const { data: a, error: eA } = await supabase
		.from('aircrafts')
		.select()
		.eq('id', log['aircraft']);
	if (eA) throw error(500, { message: eA.message });
	const aircraft = a[0];
	return { log: log as Log, aircraft: aircraft as Aircraft, ref };
}
