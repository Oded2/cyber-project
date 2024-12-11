import { addParams, format, hrefs } from '$lib';
import { error, redirect, type Actions } from '@sveltejs/kit';

export function load() {
	return { inputs };
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user }, url }) => {
		const formData = await request.formData();
		let toInsert: { [key: string]: string } = {};
		toInsert['owner'] = user!.id;
		for (const input of inputs) {
			const inputName = input.name;
			const value = formData.get(inputName) as string;
			if ((input.required && value.length == 0) || value.length > 100) {
				error(422, { message: `${format(inputName)} is invalid` });
			}
			toInsert[inputName] = value;
		}
		const { error: e } = await supabase.from('aircrafts').insert([toInsert]);
		if (e) error(400, { message: e.message });
		redirect(303, addParams(hrefs.settings, { page: 'aircraft' }, url.origin));
	}
};

const currentYear = new Date().getFullYear();

const engineTypes: string[] = [
	'Piston',
	'Turboprop',
	'Turbofan',
	'Jet Engine',
	'Electric',
	'Rotary/Wankel',
	'Rocket Engine',
	'Hybrid'
];

const aircraftCategories: string[] = [
	'Commercial',
	'Private',
	'Military',
	'Cargo',
	'Experimental',
	'Training',
	'Agricultural',
	'Rescue/Medical',
	'Recreational',
	'Research',
	'Government'
];

const aircraftTypes: string[] = [
	'Fixed-Wing',
	'Rotorcraft',
	'Unmanned Aerial Vehicle',
	'Glider',
	'Balloon',
	'Airship',
	'Amphibious',
	'Seaplane',
	'Tiltrotor',
	'Autogyro'
];

const inputs = [
	{
		name: 'nickname',
		placeholder: 'Bald Eagle',
		required: true,
		inputType: 'text',
		page: 0
	},
	{
		name: 'tail_number',
		placeholder: 'N12345',
		required: true,
		inputType: 'text',
		page: 0
	},
	{
		name: 'model',
		placeholder: 'Cessna 172',
		required: true,
		inputType: 'text',
		page: 0
	},
	{
		name: 'manufacturer',
		placeholder: 'Cessna',
		required: true,
		inputType: 'text',
		page: 0
	},
	{
		name: 'year_of_manufacture',
		required: true,
		inputType: 'number',
		page: 0,
		min: 1903,
		max: currentYear
	},
	{
		name: 'aircraft_type',
		required: true,
		inputType: 'select',
		values: aircraftTypes,
		page: 1
	},
	{
		name: 'category',
		required: true,
		inputType: 'select',
		values: aircraftCategories,
		page: 1
	},
	{
		name: 'aircraft_engine',
		required: true,
		inputType: 'select',
		values: engineTypes,
		page: 1
	},
	{
		name: 'number_of_engines',
		required: true,
		inputType: 'number',
		page: 1,
		min: 1,
		max: 999999
	},
	{
		name: 'maximum_takeoff_weight',
		required: true,
		inputType: 'number',
		page: 1,
		min: 1,
		max: 999999,
		placeholder: '(lbs)'
	},
	{
		name: 'wingspan',
		required: true,
		inputType: 'number',
		page: 2,
		min: 1,
		max: 999999,
		placeholder: '(ft)'
	},
	{
		name: 'range',
		required: true,
		inputType: 'number',
		page: 2,
		min: 1,
		max: 999999,
		placeholder: '(NM)'
	},
	{
		name: 'cruising_speed',
		required: true,
		inputType: 'number',
		page: 2,
		min: 1,
		max: 999999,
		placeholder: '(knots)'
	},
	{
		name: 'fuel_capacity',
		required: true,
		inputType: 'number',
		page: 2,
		min: 1,
		max: 999999,
		placeholder: '(gallons)'
	},
	{
		name: 'fuel_type',
		required: true,
		inputType: 'text',
		page: 2,
		placeholder: 'Avgas'
	},
	{
		name: 'owner_name',
		required: true,
		inputType: 'text',
		page: 3,
		placeholder: 'Sully'
	},
	{
		name: 'seating_capacity',
		required: true,
		inputType: 'number',
		page: 3,
		min: 1,
		max: 999999
	},
	{
		name: 'modifications',
		required: false,
		inputType: 'text',
		page: 3,
		placeholder: 'Extended fuel range'
	},
	{
		name: 'notes',
		required: false,
		inputType: 'text',
		page: 3,
		placeholder: '"Flown primarily for short-haul routes"'
	},
	{
		name: 'visibility',
		required: true,
		inputType: 'select',
		page: 3,
		values: ['private', 'public', 'unlisted'],
		allowOther: false
	}
];
