import { createClient, type PostgrestError, type SupabaseClient } from '@supabase/supabase-js';
import hrefsFile from './hrefs.json';
import { error } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

export const hrefs = hrefsFile;
export const defaultProfilePicture =
	'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png';

const max: Date = new Date();
max.setDate(max.getDate() + 60);
max.setMinutes(max.getMinutes() + 30);
export const maxDate = max;

export function createSupabaseClient(key: string) {
	return createClient(PUBLIC_SUPABASE_URL, key);
}

export function addParams(
	link: string,
	params: Record<string, string>,
	origin: string = ''
): string {
	// Adds URL parameters to a URL
	// If an origin is proved, then the url will be modified to include the origin
	const url: URL = new URL(origin.length > 0 ? origin + link : link);
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

export function closeModal(id: string): void {
	// Closes any modal by ID
	const modal = document.getElementById(id) as HTMLDialogElement;
	modal.close();
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

export function toUTC(date: Date): Date {
	return new Date(
		Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
		)
	);
}
export function getDuration(date1: Date, date2: Date): string {
	// This function takes the difference in time between two dates and formats it
	const miliseconds = Math.abs(date1.getTime() - date2.getTime());
	const hours = Math.floor(miliseconds / 3600000);
	const minutes = (miliseconds / 60000) % 60;
	if (hours == 0) return `${minutes} minutes`;
	if (minutes == 0) return `${hours} hours`;
	return `${hours} hours and ${minutes} minutes`;
}

export function handleLogs(logs: Log[]): void {
	// Helper function to ensure that logs fetched from the database are in the correct format
	// Transforms the departure and destination time to Date objects

	logs.forEach((item) => {
		item.dep_time = new Date(item.dep_time);
		item.des_time = new Date(item.des_time);
		item.created_at = new Date(item.created_at);
	});
	// Sorts the array based on the date
	logs.sort((a, b) => b.dep_time.getTime() - a.dep_time.getTime());
}

export async function deleteLog(logId: number, supabase: SupabaseClient) {
	await supabase.from('logs').delete().eq('id', logId);
}

interface Coordinates {
	latitude: number;
	longitude: number;
}
export function haversineDistance(pointA: Coordinates, pointB: Coordinates): number {
	// Mathematical function to calculate the distance between two points
	// Taken from the internet
	let radius = 6371; // km
	//convert latitude and longitude to radians
	const deltaLatitude = ((pointB.latitude - pointA.latitude) * Math.PI) / 180;
	const deltaLongitude = ((pointB.longitude - pointA.longitude) * Math.PI) / 180;

	const halfChordLength =
		Math.cos((pointA.latitude * Math.PI) / 180) *
			Math.cos((pointB.latitude * Math.PI) / 180) *
			Math.sin(deltaLongitude / 2) *
			Math.sin(deltaLongitude / 2) +
		Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2);

	const angularDistance =
		2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

	return radius * angularDistance;
}
