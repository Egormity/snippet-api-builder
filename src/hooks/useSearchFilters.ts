import { useSearch } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

import { CONSTANTS_LIBRARY, CONSTANTS_REPORTS } from "../constants";

import { useNavigateSearchParams } from "./useNavigateSearchParams";

import { NullUndefinedAble, Nullable } from "../types";

export type TFilter = {
	isOpen: boolean;
	applied: Record<string, Nullable<{ id: Nullable<string | number | boolean> }[]>>;
};

export type TFilterName =
	| keyof (typeof CONSTANTS_REPORTS)["sections"]
	| keyof (typeof CONSTANTS_LIBRARY)["sections"];

export type TUseSearchFiltersParams = Record<TFilterName, TFilter>;

export const useSearchFilters = (props?: { filterName?: NullUndefinedAble<TFilterName> }) => {
	const navigateSearchParams = useNavigateSearchParams();
	const search: {
		filters?: TUseSearchFiltersParams;
	} = useSearch({
		strict: false,
	});
	const allFilters = useMemo(() => search?.filters, [search]);

	//
	const setAllFilters = useCallback(
		(filters: TUseSearchFiltersParams) => navigateSearchParams({ search: { filters } as object }),
		[navigateSearchParams]
	);

	//
	const setFilter = useCallback(
		({
			name,
			isOpen,
			applied,
		}: {
			name: keyof TUseSearchFiltersParams;
			isOpen?: boolean;
			applied?: NullUndefinedAble<TFilter["applied"]>;
		}) => {
			// console.log(allFilters);
			navigateSearchParams({
				search: {
					filters: {
						...allFilters,
						[name]: { isOpen: isOpen || false, applied: applied || allFilters?.[name]?.applied },
					},
				} as object,
			});
		},
		[allFilters, navigateSearchParams]
	);

	//
	const getHasApplied = useCallback(
		(applied: NullUndefinedAble<TFilter["applied"]>) =>
			!!Object.values(applied || {})?.some(el => el?.some(v => !!v?.id)),
		[]
	);
	const { thisFilter, thisFilterIsOpen, thisFilterApplied, thisFilterHasApplied } = useMemo(() => {
		const thisF = props?.filterName ? allFilters?.[props?.filterName] : null;
		return {
			thisFilter: thisF,
			thisFilterIsOpen: !!thisF?.isOpen,
			thisFilterApplied: thisF?.applied,
			thisFilterHasApplied: getHasApplied(thisF?.applied),
		};
	}, [allFilters, props?.filterName, getHasApplied]);

	//
	const setThisFilter = useCallback(
		({ isOpen, applied }: { isOpen?: boolean; applied?: NullUndefinedAble<TFilter["applied"]> }) =>
			props?.filterName
				? setFilter({ name: props?.filterName, isOpen: !!isOpen, applied: applied || {} })
				: null,
		[props?.filterName, setFilter]
	);
	const setThisFilterIsOpen = useCallback(
		(isOpen: boolean) => setThisFilter({ isOpen, applied: thisFilter?.applied }),
		[thisFilter, setThisFilter]
	);
	const closeThisFilter = useCallback(
		() => setThisFilter({ isOpen: false, applied: thisFilter?.applied }),
		[setThisFilter, thisFilter]
	);
	const openThisFilter = useCallback(
		() => setThisFilter({ isOpen: true, applied: thisFilter?.applied }),
		[setThisFilter, thisFilter]
	);
	const toggleThisFilterIsOpen = useCallback(
		() => setThisFilter({ isOpen: !thisFilter?.isOpen, applied: thisFilter?.applied }),
		[setThisFilter, thisFilter]
	);
	const setThisFilterApplied = useCallback(
		(applied: NullUndefinedAble<TFilter["applied"]>) =>
			setThisFilter({ applied, isOpen: thisFilter?.isOpen }),
		[setThisFilter, thisFilter]
	);
	const setThisFilterAppliedByName = useCallback(
		(name: keyof TFilter["applied"], nameApplied: NullUndefinedAble<TFilter["applied"][typeof name]>) =>
			setThisFilter({
				applied: { ...thisFilter?.applied, [name]: nameApplied || null },
				isOpen: thisFilter?.isOpen,
			}),
		[setThisFilter, thisFilter]
	);
	const resetThisFilter = useCallback(
		(isOpen?: boolean) => setThisFilter({ isOpen: isOpen || false, applied: {} }),
		[setThisFilter]
	);

	//
	return {
		allFilters,
		setAllFilters,
		setFilter,
		getHasApplied,
		thisFilter,
		thisFilterIsOpen,
		thisFilterApplied,
		thisFilterHasApplied,
		setThisFilter,
		setThisFilterIsOpen,
		closeThisFilter,
		openThisFilter,
		toggleThisFilterIsOpen,
		setThisFilterApplied,
		setThisFilterAppliedByName,
		resetThisFilter,
	};
};
