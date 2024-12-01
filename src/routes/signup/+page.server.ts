import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
    signup: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const displayName = formData.get("display") as string;
        const username = formData.get("username") as string;
        let { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
            console.error(error)
            redirect(303, '/auth/error')
        }
        await supabase.from("profiles").insert([{ id: data.user?.id, display: displayName, username }])
        redirect(303, '/')

    }
}