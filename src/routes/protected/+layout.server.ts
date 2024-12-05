type Profile = {
    id: string;
    created_at: string;
    display: string;
    username: string;
}

export async function load({ locals: { supabase, user } }) {
    const { data } = await supabase.from("profiles").select().eq("id", user?.id)
    return { profile: (data!)[0] as Profile }

}