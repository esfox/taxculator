import { DATA_STORE_FILENAME } from '$env/static/private';
import { readFileSync, writeFileSync } from 'fs';

export const dataStoreService = {
	read<T = unknown>() {
		try {
			const data = readFileSync(DATA_STORE_FILENAME, 'utf8');
			return JSON.parse(data) as T;
		} catch (error) {
			const errorMessage = (error as Error).message;
			if (errorMessage.startsWith('ENOENT: no such file or directory')) {
				writeFileSync(DATA_STORE_FILENAME, JSON.stringify([]));
				return [];
			}
		}
	},
	save(data: Record<string, unknown> | Record<string, unknown>[]) {
		writeFileSync(DATA_STORE_FILENAME, JSON.stringify(data, null, 2));
	}
};
