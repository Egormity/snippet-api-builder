import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useMemo } from "react";

import { axiosWithAuth } from "@api";

import { TFilterName, useSearchFilters } from "@hooks";

import {
	IFilter,
	NullUndefinedAble,
	Nullable,
	RecursiveNullUndefinedAble,
	RecursiveNullUndefinedPartialAble,
	TMethodParams,
} from "@types";

import {
	TUtilHandleServiceErrorProps,
	utilApiBuildQueryParamsNew,
	utilBuildQueryParams,
	utilGetAppInfo,
	utilHandleServiceError,
} from "@utils";

export type TUseApiQueryProps<
	TResponse = any,
	TParams extends TMethodParams = any,
	TUrlReplaceParams extends Record<string, unknown> = any,
> = {
	url: string;
	queryKey: Array<unknown>;
	enabled?: NullUndefinedAble<boolean>;
	queryParams?: NullUndefinedAble<string>;
	config?: NullUndefinedAble<AxiosRequestConfig>;
	params?: NullUndefinedAble<RecursiveNullUndefinedPartialAble<TParams>>;
	onSuccess?: (data: AxiosResponse<TResponse>) => void;
	onSettled?: () => void;
	utilHandleServiceErrorProps?: Omit<Partial<TUtilHandleServiceErrorProps>, "error">;
	searchQuery?: NullUndefinedAble<string>;
	appliedFilters?: NullUndefinedAble<IFilter[]>;
	appliedFilterName?: NullUndefinedAble<TFilterName>;
	onError?: (error: Error) => void;
	singleItemId?: NullUndefinedAble<string>;
	isOnlySingleItem?: boolean;
	responseDTO?: TResponse;
} & (TUrlReplaceParams extends Record<string, unknown>
	? { URL_REPLACE_PARAMS: RecursiveNullUndefinedAble<TUrlReplaceParams> }
	: { URL_REPLACE_PARAMS: never });

export const useApiQuery = <
	TResponse = any,
	TParams extends TMethodParams = any,
	TUrlReplaceParams extends Record<string, unknown> = any,
>({
	url,
	queryKey,
	enabled = true,
	queryParams,
	config,
	params,
	onSuccess,
	onSettled,
	URL_REPLACE_PARAMS,
	utilHandleServiceErrorProps,
	searchQuery,
	appliedFilters,
	appliedFilterName,
	onError,
	singleItemId,
	isOnlySingleItem = !!singleItemId,
	responseDTO,
}: TUseApiQueryProps<TResponse, TParams, TUrlReplaceParams>) => {
	//
	const { thisFilter } = useSearchFilters({ filterName: appliedFilterName });
	const enabledFormatted = !!enabled && (isOnlySingleItem ? !!singleItemId : true);

	//
	const query = useQuery<AxiosResponse<TResponse>, Error>({
		// Do not put url here
		queryKey: [
			...queryKey,
			enabled,
			queryParams,
			config,
			params,
			URL_REPLACE_PARAMS,
			searchQuery,
			appliedFilters,
			appliedFilterName,
			thisFilter?.applied,
		],
		enabled: enabledFormatted,
		// Do not retry when trying to download file
		retry: false, // config?.responseType !== "arraybuffer" && config?.responseType !== "blob",
		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		queryFn: async () => {
			try {
				if (!enabledFormatted) throw new Error("Not enabled");
				if (utilGetAppInfo().isOfflineDev)
					return { data: responseDTO, status: 200 } as AxiosResponse<TResponse>;

				//
				const urlFormatted: string = (() => {
					if (!URL_REPLACE_PARAMS) return url;
					let newUrl: string = url;
					for (const [key, value] of Object.entries(URL_REPLACE_PARAMS)) {
						if (url.includes(`:${key}`) && !value) throw new Error(`Missing value for ${key}`);
						newUrl = newUrl.replace(`:${key}`, (value as string) + "");
					}
					return newUrl;
				})();

				//
				const filtersQueryOld = appliedFilters ? utilBuildQueryParams(appliedFilters) : "";
				const filtersQueryNew = utilApiBuildQueryParamsNew(thisFilter);
				const filtersQuery = filtersQueryNew || filtersQueryOld;

				//
				const queryParamsFormatted = (() => {
					if (filtersQuery) {
						if (queryParams) return "?" + filtersQuery + "&" + queryParams;
						return "?" + filtersQuery;
					}
					return "?" + (queryParams || "");
				})();

				//
				const paramsFormatted = {
					search: searchQuery,
					id: singleItemId,
					...(config?.params as object),
					...params,
				};
				Object.keys(paramsFormatted).forEach(key => {
					if (key.startsWith("_DEVELOP") || key.startsWith("DEVELOP"))
						delete (paramsFormatted as Record<string, unknown>)[key];
				});

				//
				const data = await axiosWithAuth.get<TResponse>(urlFormatted + queryParamsFormatted, {
					...config,
					params: paramsFormatted,
				});

				//
				onSuccess?.(data);
				return data;
			} catch (error) {
				onError?.(error as Error);
				throw utilHandleServiceError({
					isToast: true,
					baseErrorMessage: null,
					error,
					...utilHandleServiceErrorProps,
				});
			} finally {
				onSettled?.();
			}
		},
	});

	//
	type TResponseItem = TResponse extends { data: infer TData } ? TData : TResponse;
	const flatData: Nullable<TResponseItem> = useMemo(() => {
		const d = query.data?.data;
		if (d && typeof d === "object" && "data" in d) return (d.data || null) as TResponseItem;
		return (d || null) as Nullable<TResponseItem>;
	}, [query]);

	//
	type TResponseItemArr = TResponseItem extends Array<infer TItem> ? TItem : TResponseItem;
	const flatDataFirstItem: TResponseItemArr = useMemo(
		() => (flatData && Array.isArray(flatData) ? flatData[0] : flatData) as TResponseItemArr,
		[flatData],
	);

	//
	return { ...query, flatData, flatDataFirstItem };
};
