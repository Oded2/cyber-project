import { writable, type Writable } from 'svelte/store';

export type ToastType = 'success' | 'info' | 'error';

interface UserToast {
	type: ToastType;
	text: string;
	duration?: number;
}

interface Toast extends UserToast {
	id: string;
}

export const toasts: Writable<Toast[]> = writable([]);

export const addToast = (options: UserToast) => {
	const id = Math.floor(Math.random() * 10000).toString();
	const toast: Toast = {
		id,
		...options
	};
	toasts.update((all) => [toast, ...all]);
	if (toast.duration) setTimeout(() => dismissToast(id), toast.duration);
};

export const dismissToast = (id: string): void => {
	toasts.update((all) => all.filter((toast) => toast.id !== id));
};
