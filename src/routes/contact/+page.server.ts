import { hrefs } from "$lib";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { FORMSPREE_ID } from "$env/static/private";

export const actions: Actions = {
    send: async ({ request }) => {
        const formData = await request.formData();
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json",
            },
            body: JSON.stringify({
                email: formData.get("email") as string,
                message: formData.get("message") as string
            }),
        });
        if (response.ok) redirect(303, hrefs.home);
        error(500, "Unable to send form")

    }
}