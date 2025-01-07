import { error } from '@sveltejs/kit';

export async function load({ params, locals: { supabase } }) {
	const id: number = parseInt(params.slug);
	if (isNaN(id)) error(400, { message: 'Invalid Log Id' });
	const { data: l, error: eL } = await supabase.from('logs').select().eq('id', id);
	if (eL) error(500, { message: eL.message });
	if (l.length == 0) error(404, { message: 'Log not found' });
	const log = l[0];
	log['dep_time'] = new Date(log['dep_time']);
	log['des_time'] = new Date(log['des_time']);
	const { data: a, error: eA } = await supabase
		.from('aircrafts')
		.select()
		.eq('id', log['aircraft']);
	if (eA) error(500, { message: eA.message });
	const aircraft = a[0];
	return { log: log as Log, aircraft: aircraft as Aircraft };
}
