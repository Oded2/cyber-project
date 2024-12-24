import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import hrefsFile from './hrefs.json';
import { error } from '@sveltejs/kit';

export const hrefs = hrefsFile;

export function addParams(
	link: string,
	params: Record<string, string>,
	origin: string = ''
): string {
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
	const regex = /^[A-Za-z0-9]+$/;
	return regex.test(username);
}

export function validEmail(email: string): boolean {
	// Checks that an email has an 'at', a dot, and is at least 6 characters long,
	// as the bare minimum length for an email to be valid is 6 characters (a@b.cd)
	return email.length >= 6 && email.includes('@') && email.includes('.');
}

export function format(s: string, space: string = '_') {
	// Formats a string to display to a user in an adequate way
	return s
		.split(space)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function toInputElement(event: Event) {
	// Turns events into input element in order to allow for cleaner code
	return event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
}

export function showModal(id: string): void {
	// Opens any modal by ID
	const modal = document.getElementById(id) as HTMLDialogElement;
	modal.showModal();
}

export function formatDateTime(date: Date): string {
	// Helper function to format date and time as YYYY-MM-DDTHH:MM
	const year = date.getFullYear();
	// Month is zero-based index, so it's necessary to add one
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDate(date: Date): string {
	const formatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	return formatter.format(date);
}

export function handleError(e: PostgrestError | null): void {
	if (e) error(500, { message: e.message });
}
