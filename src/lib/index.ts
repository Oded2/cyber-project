import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import hrefsFile from "./hrefs.json"

export const hrefs = hrefsFile

export function addParams(link: string, params: Record<string, string>, origin: string = ""): string {
    // Adds URL parameters to a URL
    const url = new URL(origin.length > 0 ? origin + link : link);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });
    return url.toString();
}

export async function isTaken(username: string, supabase: SupabaseClient): Promise<boolean> {
    // Checks to see if a username is taken
    const { data, error } = await supabase.from('profiles').select().eq('username', username);
    if (error) return true;
    return data.length > 0;
}
export function capitalizeFirstLetter(value: string) {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
export function validUsername(username: string): boolean {
    // Checks to see if a username contains only latin letters and numbers
    if (username.length == 0) return true;
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(username);
};

export function format(s: string, space: string = "_") {
    // Formats a string to display to a user in an adequate way
    return s.split(space).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

export function toInputElement(event: Event) {
    return event.target as HTMLInputElement | HTMLSelectElement
}