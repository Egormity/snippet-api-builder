import { useEffect, useState } from "react";

import { CONSTANTS_TIME } from "../constants";

export const useDebouncedValue = <T>(value: T, delay: number = CONSTANTS_TIME.debounceDelayMs) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	//
	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(handler);
	}, [value, delay]);

	//
	return debouncedValue;
};
