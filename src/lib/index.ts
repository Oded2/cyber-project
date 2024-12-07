import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import hrefsFile from "./hrefs.json"

export const hrefs = hrefsFile

export function addParams(link: string, params: Record<string, string>, origin: string = ""): string {
    const url = new URL(origin.length > 0 ? origin + link : link);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });
    return url.toString();
}

export async function isTaken(username: string, supabase: SupabaseClient): Promise<boolean> {
    const { data, error } = await supabase.from('profiles').select().eq('username', username);
    if (error) return true;
    return data.length > 0;
}
export function capitalizeFirstLetter(value: string) {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
export function validUsername(username: string): boolean {
    if (username.length == 0) return true;
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(username);
};