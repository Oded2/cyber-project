import { handleLogs, handleProfiles, publicOnly } from '$lib';
import { error } from '@sveltejs/kit';

export async function load({ params, locals: { supabase, user } }) {
	const username = params.slug;
	const { data: profiles, error: eP } = await supabase
		.from('profiles')
		.select()
		.eq('username', username);
	if (eP) error(500, { message: eP.message });
	if (profiles.length == 0) error(404, { message: "Username doesn't exist" });
	handleProfiles(profiles);
	const profile = profiles[0] as Profile;
	const { data: logs, error: eL } = await supabase.from('logs').select().eq('owner', profile.id);
	if (eL) error(500, { message: eL.message });
	handleLogs(logs);
	const { data: aircrafts, error: eA } = await supabase
		.from('aircrafts')
		.select()
		.eq('owner', profile.id);
	if (eA) error(500, { message: eA.message });
	// If the user is viewing his own profile, then all logs will be accounted for, else only the public ones
	if (!user || user.id !== profile.id) {
		publicOnly(logs);
		publicOnly(aircrafts);
	}
	// The reason for this filter is because even though private logs will regardless only be fetched if the user
	// has access to them, the unlisted ones will still get fetched
	// While unlisted logs are accessible by anyone, they shouldn't be accounted for in a public profile page
	return { profile, logs: logs as Log[], aircrafts: aircrafts as Aircraft[] };
}
