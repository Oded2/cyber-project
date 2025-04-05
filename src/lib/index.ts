import { createClient, PostgrestError, type SupabaseClient } from '@supabase/supabase-js';
import hrefsFile from './hrefs.json';
import countriesFile from './countries.json';
import bannedCountriesFile from './banned.json';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import defaultPFP from './images/defaultPFP.png';
import type { AnimationConfig } from 'svelte/animate';
import { addToast } from './toasts';

export const hrefs = hrefsFile;
export const countries = countriesFile as { [key: string]: string };
export const bannedCountries = bannedCountriesFile;
export const defaultProfilePicture = defaultPFP;
export const usernameRegex = /^[A-Za-z0-9]+$/;
export const flipConfig: AnimationConfig = { duration: 500 };

const min: Date = new Date();
min.setDate(min.getDate() - 14);
// Set to midnight to allow slightly more than exactly 2 weeks
min.setHours(0, 0, 0, 0);
const max: Date = new Date();
max.setDate(max.getDate() + 6);
max.setMinutes(max.getMinutes() + 30);
export const minDate = min;
export const maxDate = max;

export function createSupabaseClient(key: string) {
	return createClient(PUBLIC_SUPABASE_URL, key);
}

export function addParams(link: string, params: Record<string, string>): string {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		searchParams.append(key, value);
	});
	return `${link}?${searchParams.toString()}`;
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

export function extractDate(date: Date = new Date()): string {
	return toLocalISOString(date).split('T')[0];
}

export function extractTime(date: Date = new Date()): string {
	// Extract HH:MM format
	return toLocalISOString(date).slice(11, 16);
}

export function combineDateTime(date: string, time: string): Date {
	const dateTimeString = `${date}T${time}:00`; // Append seconds for ISO format
	return new Date(dateTimeString); // Return Date object
}

export function formatDate(date: Date): string {
	const formatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	return formatter.format(date);
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

export function getTimeDifference(dateA: Date, dateB: Date): number {
	return Math.abs(dateA.getTime() - dateB.getTime());
}

export function formatDuration(miliseconds: number): string {
	const hours = Math.floor(miliseconds / 3600000);
	const minutes = (miliseconds / 60000) % 60;
	if (hours == 0) return `${minutes} minutes`;
	if (minutes == 0) return `${hours} hours`;
	return `${hours} hours and ${minutes} minutes`;
}

export function getDuration(dateA: Date, dateB: Date): string {
	// This function takes the difference in time between two dates and formats it
	return formatDuration(getTimeDifference(dateA, dateB));
}

export function handleLogs(logs: any[]): void {
	// Helper function to ensure that logs fetched from the database are in the correct format
	// Transforms the departure and destination time to Date objects
	const pointer = logs as Log[];
	pointer.forEach((item) => {
		item.dep_time = new Date(item.dep_time);
		item.des_time = new Date(item.des_time);
		item.created_at = new Date(item.created_at);
	});
	// Sorts the array based on the date
	pointer.sort((a, b) => b.dep_time.getTime() - a.dep_time.getTime());
}

export function handleProfiles(profiles: any[]): void {
	const pointer = profiles as Profile[];
	pointer.forEach((item) => (item.created_at = new Date(item.created_at)));
}

export async function deleteLog(logId: number, supabase: SupabaseClient) {
	await supabase.from('logs').delete().eq('id', logId);
}

export function publicOnly(items: any[]): void {
	const pointer = items as Log[] | Aircraft[];
	pointer.forEach((item, index) => {
		if (item.visibility !== 'public') pointer.splice(index, 1);
	});
}

export function divideArray<T>(arr: T[], n: number): T[] {
	// Function to divide a generic array to 'n' equal parts
	// Does not guarantee that the returned array is of 'n' length
	const result: T[] = [];
	const { length } = arr;
	const jump = Math.floor(length / n);
	for (let i = 0; i < length; i += jump) {
		result.push(arr[i]);
	}
	return result;
}

export function getDatesBetween(start: Date, end: Date, n: number): Date[] {
	/**
	 * Returns an array of Date objects between the start and end dates (inclusive),
	 * evenly spaced so that the resulting array is of length n.
	 *
	 * @param start - The starting Date.
	 * @param end - The ending Date.
	 * @param n - The total number of dates you want (including start and end).
	 * @returns An array of Date objects.
	 */
	if (n < 2) {
		// If n is less than 2, return only the start date (or choose how to handle this case)
		return [new Date(start)];
	}

	const startTime = start.getTime();
	const endTime = end.getTime();
	const interval = (endTime - startTime) / (n - 1);
	const dates: Date[] = [];
	for (let i = 0; i < n; i++) {
		// Create a new Date by adding i * interval milliseconds to the start date
		dates.push(new Date(startTime + i * interval));
	}

	return dates;
}

export async function handleButtonAwait(
	btn: HTMLButtonElement,
	fn: () => Promise<any> | any,
	doc: Document,
	spinner: boolean = false
): Promise<void> {
	// Disable the button to prevent repeated clicks during the operation
	btn.disabled = true;
	if (spinner) {
		// Store the original text to restore it later
		const originalText = btn.textContent;
		// Lock the button's width to prevent layout shift when text is replaced
		const originalWidth = btn.offsetWidth;
		btn.style.width = `${originalWidth}px`;
		// Clear the button's content
		btn.textContent = null;
		// Create and append a spinner element
		const spinner = doc.createElement('span');
		spinner.classList.add('loading', 'loading-spinner');
		btn.appendChild(spinner);
		// Execute the provided function and wait for completion
		await fn();
		// Remove the spinner and restore original button content
		btn.removeChild(spinner);
		btn.textContent = originalText;
	} else {
		// If no spinner is needed, just await the function directly
		await fn();
	}
	// Re-enable the button after the operation completes
	btn.disabled = false;
}

export function handleSupabaseError(e: PostgrestError): void {
	console.error(e);
	addToast({ type: 'error', text: `Error encountered: ${e.message}`, duration: 5000 });
}

export function handleFormData(formData: FormData): { [key: string]: string | null } {
	return Object.fromEntries(
		formData.entries().map(([key, value]) => {
			return [key, value.toString().length > 0 ? value.toString() : null];
		})
	);
}

function toLocalISOString(date: Date): string {
	// Returns a local time ISO-like string (without converting to UTC)
	return (
		date.getFullYear() +
		'-' +
		(date.getMonth() + 1).toString().padStart(2, '0') + // Month (1-based)
		'-' +
		date.getDate().toString().padStart(2, '0') + // Day
		'T' +
		date.getHours().toString().padStart(2, '0') + // Hours
		':' +
		date.getMinutes().toString().padStart(2, '0') + // Minutes
		':' +
		date.getSeconds().toString().padStart(2, '0') + // Seconds
		'.' +
		date.getMilliseconds().toString().padStart(3, '0') // Milliseconds
	);
}
