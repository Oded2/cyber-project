import { error } from '@sveltejs/kit';

export async function load({ params, locals: { supabase } }) {
	const username = params.slug;
	const { data: profiles, error: e } = await supabase
		.from('profiles')
		.select()
		.eq('username', username);
	if (e) error(500, { message: e.message });
	if (profiles.length == 0) error(404, { message: "Username doesn't exist" });
	return { profile: profiles as Profile[] };
}
