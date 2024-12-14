type CurrentPage = 'profile' | 'account' | 'logbook' | 'aircraft';

export async function load({ url, locals: { supabase, user } }) {
	const aircrafts: Aircraft[] = [];
	let { data: temp } = await supabase.from('aircrafts').select().eq('owner', user?.id);
	// If temp is null, it will become an empty array
	temp = temp ?? [];
	for (let i = 0; i < temp.length; i++) aircrafts[i] = temp[i];
	return { page: (url.searchParams.get('page') ?? 'profile') as CurrentPage, aircrafts };
}
