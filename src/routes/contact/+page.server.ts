import { error, type Actions } from '@sveltejs/kit';
import { FORMSPREE_ID } from '$env/static/private';
import { validEmail } from '$lib';

export const actions: Actions = {
	send: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const message = formData.get('message') as string;
		if (!validEmail(email)) error(422, { message: 'Invalid Email' });
		if (message.length < 10) {
			// Ensures that the message isn't too short to have any meaning
			error(422, { message: 'Message must be at least 10 characters' });
		}
		const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				email,
				message
			})
		});
		// Response has been sent to formspree
		if (response.ok) return { success: true };
		// Error encountered
		error(response.status, { message: 'Unable to send form' });
	}
};
