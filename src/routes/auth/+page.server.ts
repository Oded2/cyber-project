import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export function load({ url }) {
    return { signup: url.searchParams.get("page") === "signup" }
}
export const actions: Actions = {
    signup: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const displayName = formData.get("display") as string;
        const username = formData.get("username") as string;
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
            console.error(error)
            redirect(303, '/auth/error')
        }
        await supabase.from("profiles").insert([{ id: data.user?.id, display: displayName, username }])
        redirect(303, '/')

    },
    login: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            console.error(error)
            redirect(303, '/auth/error')
        } else {
            redirect(303, '/')
        }
    }
}