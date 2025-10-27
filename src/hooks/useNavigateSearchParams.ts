import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { useDoAfterDebounce } from "./useDoAfterDebounce";

import { TAppSearchParams } from "../types";

import { utilGetAppInfo } from "../utils";

//
export type TUseNavigateSearchParamsProps = {
	isDebounce?: boolean;
};
export type TUseNavigateSearchParamsCallProps = {
	to?: string;
	search?: TAppSearchParams;
	preserveSearch?: boolean;
	isAppTypeNameTo?: boolean;
};

//
export const useNavigateSearchParams = (props?: TUseNavigateSearchParamsProps) => {
	const navigate = useNavigate();
	const doAfterDebounce = useDoAfterDebounce(props?.isDebounce ? undefined : false);
	const { appTypeName } = utilGetAppInfo();

	//
	const fn = useCallback(
		({ to, search, preserveSearch = true, isAppTypeNameTo = false }: TUseNavigateSearchParamsCallProps) => {
			doAfterDebounce(() => {
				navigate({
					to: to && isAppTypeNameTo ? `/${appTypeName}${to}` : to,
					// @ts-ignore
					search: (args: object) => ({
						...(preserveSearch === false ? {} : args),
						...search,
					}),
				}).catch(console.log);
			});
		},
		[doAfterDebounce, navigate, appTypeName]
	);

	//
	return fn;
};
