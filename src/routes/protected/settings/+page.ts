type CurrentPage = 'profile' | 'account' | 'logbook' | 'aircraft';

export function load({ url }) {
	return { page: (url.searchParams.get('page') ?? 'profile') as CurrentPage };
}
