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
		points: Position[];
	}

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

	interface Airport {
		ident: string;
		type: string;
		name: string;
		latitude_deg: number;
		longitude_deg: number;
		elevation_ft: string;
		continent: string;
		iso_country: string;
		iso_region: string;
		municipality: string;
		scheduled_service: string;
		gps_code: string;
		iata_code: string;
		local_code: string;
		home_link: string;
		wikipedia_link: string;
		keywords: string;
		icao_code: string;
		runways: {
			id: string;
			airport_ref: string;
			airport_ident: string;
			length_ft: string;
			width_ft: string;
			surface: string;
			lighted: string;
			closed: string;
			le_ident: string;
			le_latitude_deg: string;
			le_longitude_deg: string;
			le_elevation_ft: string;
			le_heading_degT: string;
			le_displaced_threshold_ft: string;
			he_ident: string;
			he_latitude_deg: string;
			he_longitude_deg: string;
			he_elevation_ft: string;
			he_heading_degT: string;
			he_displaced_threshold_ft: string;
			he_ils?: {
				freq: number;
				course: number;
			};
			le_ils?: {
				freq: number;
				course: number;
			};
		}[];
		freqs: {
			id: string;
			airport_ref: string;
			airport_ident: string;
			type: string;
			description: string;
			frequency_mhz: string;
		}[];
		country: {
			id: string;
			code: string;
			name: string;
			continent: string;
			wikipedia_link: string;
			keywords: string;
		};
		region: {
			id: string;
			code: string;
			local_code: string;
			name: string;
			continent: string;
			iso_country: string;
			wikipedia_link: string;
			keywords: string;
		};
		navaids: {
			id: string;
			filename: string;
			ident: string;
			name: string;
			type: string;
			frequency_khz: string;
			latitude_deg: string;
			longitude_deg: string;
			elevation_ft: string;
			iso_country: string;
			dme_frequency_khz: string;
			dme_channel: string;
			dme_latitude_deg: string;
			dme_longitude_deg: string;
			dme_elevation_ft: string;
			slaved_variation_deg: string;
			magnetic_variation_deg: string;
			usageType: string;
			power: string;
			associated_airport: string;
		}[];
		station: {
			icao_code: string;
			distance: number;
		};
	}
}

export {};
