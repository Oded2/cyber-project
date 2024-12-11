import { error, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { addParams, hrefs, isTaken, validEmail, validUsername } from '$lib';

export function load({ url }) {
	const params = url.searchParams;
	const errorMessage = (params.get('error') ?? '') as string;
	return { signup: params.get('page') === 'signup', errorMessage };
}
export const actions: Actions = {
	signup: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const displayName = formData.get('display') as string;
		const username = formData.get('username') as string;
		// Collected all form data, and conveniently stores them as a string
		validate(email, 'Email', 0);
		validate(password, 'Password', 8, 128);
		validate(displayName, 'Display Name', 0, 50);
		validate(username, 'Username', 0, 50);
		// At this stage all inputs are within sufficient length
		if (!validUsername(username)) error(422, { message: 'Invalid Username' });
		if (!validEmail(email)) error(422, { message: 'Invalid Email' });
		// At this stage all non-asynchronous validation functions have ran
		if (await isTaken(username, supabase)) {
			// Checks if the username is taken, and if it is, it returns the user to the
			// sign up page with the inputs already filled from before so the user doesn't
			// lose progress
			return {
				signup: true,
				email,
				password,
				displayName,
				username,
				invalidUsername: true
			};
		}
		const { data, error: e } = await supabase.auth.signUp({ email, password });
		if (e) {
			// Email and password are sent off to supabase, which then validates
			// the values, and if the values are invalid, the user is met with an
			// error
			error(e.status ?? 400, { message: e.message });
		}
		// At this stage the user has been signed up to supabase and is given an id
		const { error: profileFetchError } = await supabase
			.from('profiles')
			.insert([{ id: data.user?.id, display: displayName, username }]);
		if (profileFetchError) {
			// Error shouldn't occur due to previous validation, but if
			// it does then the user is met with an error
			error(400, { message: profileFetchError.message });
		}
		// The user now has an account and profile, and is redirected to a page with instructions
		redirect(
			303,
			addParams(
				hrefs.message,
				{ message: `An email has been sent to ${email} with a confirmation link` },
				url.origin
			)
		);
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const { error: e } = await supabase.auth.signInWithPassword({ email, password });
		if (e) {
			const message = e.message;
			if (message === 'Invalid login credentials') return { invalidCredentials: true };
			console.error(e);
			error(e.status!, { message: message });
		} else {
			redirect(303, hrefs.home);
		}
	},
	reset: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const redirectTo = addParams(hrefs.home, { redirect: hrefs.passwordReset }, url.origin);
		const { error: e } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
		if (e) error(e.status ?? 400, { message: e.message });
		redirect(
			303,
			addParams(
				hrefs.message,
				{ message: `A password reset link has been sent to ${email}` },
				url.origin
			)
		);
	}
};

function validate(input: string, inputName: string, min: number = 0, max: number = 500): void {
	if (input.length < min)
		error(422, { message: `${inputName} must be at least ${min} characters long.` });
	if (input.length > max) error(422, { message: `${inputName} cannot exceed ${max} characters.` });
}
