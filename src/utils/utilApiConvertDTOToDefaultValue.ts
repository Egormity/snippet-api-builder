// @ts-nocheck
import { RecursiveToNull } from "../types";

export const utilApiConvertDTOToDefaultValues = <T extends object | null | undefined>(
	obj: T
): RecursiveToNull<T> | null => {
	if (!obj) return null;
	const result: RecursiveToNull<T> = {} as RecursiveToNull<T>;

	for (const key in obj) {
		if (Array.isArray(obj[key])) {
			// Handle arrays - set to empty array and process each element if they're objects
			result[key] = [];
			const array = obj[key];
			if (array.length > 0 && typeof array[0] === "object" && array[0] !== null) {
				result[key] = array.map(item => utilApiConvertDTOToDefaultValues(item));
			}
		} else if (typeof obj[key] === "object" && obj[key] !== null) {
			// Handle nested objects recursively
			result[key] = utilApiConvertDTOToDefaultValues(obj[key]);
		} else {
			// Handle primitives (string, number, boolean, etc.)
			result[key] = null;
		}
	}

	return result;
};
