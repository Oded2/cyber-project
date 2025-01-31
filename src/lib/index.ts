import { createClient, type PostgrestError, type SupabaseClient } from '@supabase/supabase-js';
import hrefsFile from './hrefs.json';
import countriesFile from './countries.json';
import { error } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

export const hrefs = hrefsFile;
export const countries = countriesFile as { [key: string]: string };
export const defaultProfilePicture =
	'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png';

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

export async function getWeatherData(time: Date, long: number, lat: number): Promise<Weather> {
	// Retrieves inforamtion about the weather for a specific date
	interface WeatherData {
		latitude: number;
		longitude: number;
		generationtime_ms: number;
		utc_offset_seconds: number;
		timezone: string;
		timezone_abbreviation: string;
		elevation: number;
		hourly_units: {
			time: string;
			temperature_2m: string;
			relative_humidity_2m: string;
			dew_point_2m: string;
			precipitation: string;
			weather_code: string;
			pressure_msl: string;
			surface_pressure: string;
			cloud_cover: string;
			visibility: string;
			wind_speed_180m: string;
			wind_direction_180m: string;
			temperature_180m: string;
		};
		hourly: {
			time: string[];
			temperature_2m: number[];
			relative_humidity_2m: number[];
			dew_point_2m: number[];
			precipitation: number[];
			weather_code: number[];
			pressure_msl: number[];
			surface_pressure: number[];
			cloud_cover: number[];
			visibility: number[];
			wind_speed_180m: number[];
			wind_direction_180m: number[];
			temperature_180m: number[];
		};
	}

	const oneHourDiff = (date1: Date, date2: Date): boolean => {
		// Checks that the difference between two dates is less than an hour
		return Math.abs(date1.getTime() - date2.getTime()) < 3600000;
	};
	const apiUrl = 'https://api.open-meteo.com/v1/forecast';
	// Converts the date to UTC to adjust for timezone differences
	const date = toUTC(time).toISOString().split('T')[0];
	const params: Record<string, string> = {
		longitude: long.toString(),
		latitude: lat.toString(),
		hourly:
			'temperature_2m,relative_humidity_2m,dew_point_2m,precipitation,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_180m,wind_direction_180m,temperature_180m',
		wind_speed_unit: 'kn',
		start_date: date,
		end_date: date
	};
	const url: string = addParams(apiUrl, params);
	const response: Response = await fetch(url);
	if (!response.ok) error(response.status, { message: response.statusText });
	const json: WeatherData = (await response.json()) as WeatherData;
	const hourlyData = json.hourly;
	const hourlyIndex = hourlyData.time.findIndex((item) => oneHourDiff(new Date(item), time));
	return {
		temperature: hourlyData.temperature_2m[hourlyIndex],
		dewPoint: hourlyData.dew_point_2m[hourlyIndex],
		humidity: hourlyData.relative_humidity_2m[hourlyIndex],
		precipation: hourlyData.precipitation[hourlyIndex],
		pressure: hourlyData.pressure_msl[hourlyIndex],
		cloud_cover: hourlyData.cloud_cover[hourlyIndex],
		visibility: hourlyData.visibility[hourlyIndex],
		wind_speed: hourlyData.wind_speed_180m[hourlyIndex],
		wind_direction: hourlyData.wind_direction_180m[hourlyIndex]
	};
}

export function publicOnly(items: any[]): void {
	const pointer = items as Log[] | Aircraft[];
	pointer.forEach((item, index) => {
		if (item.visibility !== 'public') pointer.splice(index, 1);
	});
}

export function showAlert(id: string) {
	const alert = document.getElementById(id) as HTMLButtonElement;
	alert.click();
}

export function haversineDistance(
	pointA: { latitude: number; longitude: number },
	pointB: { latitude: number; longitude: number }
): number {
	// Mathematical function to calculate the distance between two points
	// Taken from the internet
	const radius = 6371; // km
	// Convert latitude and longitude to radians
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
