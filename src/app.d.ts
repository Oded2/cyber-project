import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
	interface Log {
		id: number; // bigint
		owner: string; // uuid
		created_at: string; // timestamp with time zone
		dep_time: Date; // timestamp with time zone
		des_time: Date; // timestamp with time zone
		dep_airport: string; // text
		des_airport: string; // text
		aircraft: number; // bigint (foreign key referencing aircrafts)
		notes: string; // text
		altitude?: number; // integer (optional)
		pilot_in_command: string; // text
		visibility: 'public' | 'unlisted' | 'private'; // text with constraints
		fuel_usage?: number; // bigint (optional)
		rating: 'visual' | 'instrument'; // text with constraints
	}
	interface Aircraft {
		id: number; // bigint
		created_at: string; // timestamp with time zone
		nickname: string; // text
		tail_number: string; // text
		model: string; // text
		manufacturer: string; // text
		year_of_manufacture: number; // integer
		aircraft_type: string; // text
		category: string; // text
		aircraft_engine: string; // text
		number_of_engines: number; // integer
		maximum_takeoff_weight: number; // integer
		wingspan: number; // integer
		range: number; // integer
		cruising_speed: number; // integer
		fuel_capacity: number; // integer
		fuel_type: string; // text
		owner_name: string; // text
		seating_capacity: number; // integer
		modifications: string; // text
		notes: string; // text
		visibility: 'public' | 'private' | 'unlisted'; // text with constraints
		owner: string; // uuid
	}
}

export {};
