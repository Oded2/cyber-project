import { handleLogs, publicOnly } from '$lib';
import { error } from '@sveltejs/kit';

export async function load({ params, locals: { user, supabase } }) {
	// Get the aircraft's id
	const id = params.slug;
	// Fetch the aircraft
	const { data: aircrafts, error: eA } = await supabase.from('aircrafts').select().eq('id', id);
	if (eA) error(500, { message: eA.message });
	if (aircrafts.length == 0) error(404, { message: `No aircraft was found with the id "${id}"` });
	// Store the aircraft inside a variable
	const aircraft = aircrafts[0] as Aircraft;
	// Store the owner of the aircraft
	const owner = aircraft.owner;
	// Fetch the owner's profile
	const { data: profiles, error: eP } = await supabase.from('profiles').select().eq('id', owner);
	if (eP) error(500, { message: eP.message });
	// Store the profile inside a variable
	const profile = profiles[0] as Profile;
	// Fetch the logs that have use this aircraft
	const { data: logs, error: eL } = await supabase.from('logs').select().eq('aircraft', id);
	if (eL) error(500, { message: eL.message });
	handleLogs(logs);
	if (!user || user.id !== owner) publicOnly(logs);
	return { aircraft, profile, logs: logs as Log[] };
}
