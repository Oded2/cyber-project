export function load({ url }) {
	return { page: url.searchParams.get('page') };
}
