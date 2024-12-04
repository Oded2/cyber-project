import { hrefs, addParams } from "$lib";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { FORMSPREE_ID } from "$env/static/private";

export function load({ url }) {
    return { success: url.searchParams.get("success") === "true" }
}

export const actions: Actions = {
    send: async ({ request, url }) => {
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const message = formData.get("message") as string;
        if (message.length < 10) error(500, { "message": "Message must be at least 10 characters" })
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json",
            },
            body: JSON.stringify({
                email, message
            }),
        });
        if (response.ok) redirect(303, addParams(hrefs.contact, { success: "true" }, url.origin));
        error(400, { "message": "Unable to send form" })

    }
}