import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Position } from 'geojson';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			getUser: () => Promise<{ user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
	type SelectValues = {
		id: string;
		display: string;
	}[];
	interface Profile {
		id: string;
		created_at: Date;
		display: string;
		username: string;
		bio: string;
		image: string;
		country: string;
		bannedCountries: string[];
		[key: string]: string | Date | string[];
	}
	interface Log {
		id: number;
		owner: string;
		created_at: Date;
		dep_time: Date;
		des_time: Date;
		dep_airport: Airport;
		des_airport: Airport;
		aircraft: number;
		notes: string;
		altitude: number | null;
		pilot_in_command: string;
		visibility: 'public' | 'unlisted' | 'private';
		fuel_usage: number | null;
		rating: 'visual' | 'instrument';
		weather_data: Weather[] | null;
		favorite: boolean;
		true_weather: boolean;
	}
	// interface Aircraft {
	// 	id: number; // bigint
	// 	created_at: string; // timestamp with time zone
	// 	nickname: string; // text
	// 	tail_number: string; // text
	// 	model: string; // text
	// 	manufacturer: string; // text
	// 	year_of_manufacture: number; // integer
	// 	aircraft_type: string; // text
	// 	category: string; // text
	// 	aircraft_engine: string; // text
	// 	number_of_engines: number; // integer
	// 	maximum_takeoff_weight: number; // integer
	// 	wingspan: number; // integer
	// 	range: number; // integer
	// 	cruising_speed: number; // integer
	// 	fuel_capacity: number; // integer
	// 	fuel_type: string; // text
	// 	owner_name: string; // text
	// 	seating_capacity: number; // integer
	// 	image_url: string; // text
	// 	notes: string; // text
	// 	visibility: 'public' | 'private' | 'unlisted'; // text with constraints
	// 	owner: string; // uuid
	// }
	interface Aircraft {
		id: number; // bigint
		created_at: string; // timestamp with time zone
		nickname: string; // text
		tail_number: string; // text
		model?: string; // text | optional
		manufacturer?: string; // text | optional
		year_of_manufacture?: number; // integer | optional
		aircraft_type: string; // text
		category: string; // text
		aircraft_engine: string; // text
		number_of_engines?: number; // integer | optional
		maximum_takeoff_weight?: number; // integer | optional
		wingspan?: number; // integer | optional
		range?: number; // integer | optional
		cruising_speed?: number; // integer | optional
		fuel_capacity?: number; // integer | optional
		fuel_type?: string; // text | optional
		owner_name?: string; // text | optional
		seating_capacity?: number; // integer | optional
		image_url?: string; // text | optional
		notes?: string; // text | optional
		visibility: 'public' | 'private' | 'unlisted';
		owner: string; // uuid
	}
	interface Airport {
		icao: string;
		iata: string;
		name: string;
		city: string;
		region: string;
		country: string;
		elevation_ft: string;
		latitude: number;
		longitude: number;
		timezone: string;
	}
	interface Weather {
		temperature: number;
		dewPoint: number;
		humidity: number;
		precipation: number;
		pressure: number;
		cloud_cover: number;
		visibility: number;
		wind_speed: number;
		wind_direction: number;
		coord: Position;
	}
}

export {};
