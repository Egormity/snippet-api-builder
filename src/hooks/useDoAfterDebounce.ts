import { debounce } from "@mui/material";
import { useCallback } from "react";

import { CONSTANTS_TIME } from "../constants";

export const useDoAfterDebounce = (debounceMs: number | false = CONSTANTS_TIME.debounceDelayMs) => {
	const doAfterDebounce = useCallback(
		debounce(
			(fn: (() => void) | (() => Promise<void>)) => {
				fn();
			},
			debounceMs === false ? 0 : debounceMs
		),
		[]
	);

	//
	return doAfterDebounce;
};
