import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

import { axiosWithAuth } from "@api";

import { CONSTANTS_API } from "@constants";

import { TFilterName, useSearchFilters } from "@hooks";

import { IFilter, NullUndefinedAble, RecursiveNullUndefinedPartialAble, TMethodParams } from "@types";

import { utilApiBuildQueryParamsNew, utilBuildQueryParams, utilGetAppInfo } from "@utils";

type TResponse<TDataArrayItem> = {
	data: Record<string, TDataArrayItem[]> & {
		totals: {
			all_count: number;
			all_pages: number;
			current_page: number;
			page_size: number;
			current_size: number;
		};
	};
	success: boolean;
};

//
export type TUseApiInfiniteQueryProps<TDataArrayItem = any, TParams extends TMethodParams = any> = {
	enabled?: NullUndefinedAble<boolean>;
	queryKey: Array<unknown>;
	url: string;
	accessDataName?: string;
	queryParams?: NullUndefinedAble<string>;
	searchQuery?: NullUndefinedAble<string>;
	config?: NullUndefinedAble<AxiosRequestConfig>;
	params?: NullUndefinedAble<
		RecursiveNullUndefinedPartialAble<
			TParams & {
				pageSize: 1 | 25 | 1000;
			}
		>
	>;
	onSuccess?: (data: AxiosResponse<TResponse<TDataArrayItem>>) => void;
	singleItemId?: NullUndefinedAble<string>;
	pageSize?: NullUndefinedAble<number>;
	appliedFilters?: NullUndefinedAble<IFilter[]>;
	appliedFilterName?: NullUndefinedAble<TFilterName>;
	isOnlySingleItem?: boolean;
	responseDTOInfiniteQueryArrayInner?: TDataArrayItem;
};

//
export const useApiInfiniteQuery = <TDataArrayItem = any, TParams extends TMethodParams = any>({
	enabled = true,
	queryKey,
	url,
	accessDataName = "results",
	queryParams,
	searchQuery,
	config,
	onSuccess,
	singleItemId,
	pageSize = singleItemId ? 1 : CONSTANTS_API.pageSizeInfinite,
	params,
	appliedFilters,
	appliedFilterName,
	isOnlySingleItem = false,
	responseDTOInfiniteQueryArrayInner,
}: TUseApiInfiniteQueryProps<TDataArrayItem, TParams>) => {
	const [pageSizeLocal, setPageSizeLocal] = useState(pageSize);

	//
	const { thisFilter } = useSearchFilters({ filterName: appliedFilterName });

	//
	useEffect(() => {
		setPageSizeLocal(pageSize);
	}, [pageSize]);

	//
	const enabledFormatted = !!enabled && (isOnlySingleItem ? !!singleItemId : true);

	//
	const result = useInfiniteQuery<AxiosResponse<TResponse<TDataArrayItem>>, Error>({
		// Do not put url here
		queryKey: [
			...queryKey,
			enabled,
			accessDataName,
			queryParams,
			searchQuery,
			config,
			singleItemId,
			pageSizeLocal,
			params,
			appliedFilters,
			thisFilter?.applied,
			isOnlySingleItem,
		],
		enabled: enabledFormatted,
		queryFn: async ({ pageParam = 1 }: { pageParam: unknown }) => {
			try {
				if (!enabledFormatted) throw new Error("Not enabled");
				if (utilGetAppInfo().isOfflineDev)
					return {
						data: {
							data: {
								totals: {
									all_count: 25,
									all_pages: 1,
									current_page: 1,
									page_size: 25,
									current_size: 25,
								},
								[accessDataName]: Array.from({ length: 25 }, (_, i) => {
									if (
										!responseDTOInfiniteQueryArrayInner ||
										typeof responseDTOInfiniteQueryArrayInner !== "object"
									)
										return responseDTOInfiniteQueryArrayInner;
									const id =
										"id" in responseDTOInfiniteQueryArrayInner
											? responseDTOInfiniteQueryArrayInner?.["id"]
											: 0;
									return {
										...responseDTOInfiniteQueryArrayInner,
										id: typeof id === "string" ? id.slice(0, -i.toString().length) + i : i,
									};
								}),
							},
							success: true,
						},
						status: 200,
					} as AxiosResponse<TResponse<TDataArrayItem>>;

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
					pageSize: pageSizeLocal,
					search: searchQuery,
					page: pageParam,
					id: singleItemId,
					...(config?.params as object),
					...(params as object),
				};
				Object.keys(paramsFormatted).forEach(key => {
					if (key.startsWith("_DEVELOP") || key.startsWith("DEVELOP"))
						delete (paramsFormatted as Record<string, unknown>)[key];
				});

				//
				const data = await axiosWithAuth.get<TResponse<TDataArrayItem>>(url + queryParamsFormatted, {
					...config,
					params: paramsFormatted,
				});

				//
				onSuccess?.(data);
				return data;
			} catch (error) {
				console.log("useApiInfiniteQuery", error);
				throw new Error("useApiInfiniteQuery - Failed to fetch data");
			}
		},
		getNextPageParam: lastPage => {
			const totals = lastPage?.data?.data.totals;
			if (!totals) return; // Остановить пагинацию, если данные отсутствуют
			const { current_page, all_pages } = totals;
			return current_page < all_pages ? current_page + 1 : undefined;
		},
		refetchOnWindowFocus: false,
		initialPageParam: 1,
	});

	//
	const handleFetchAllChange = useCallback(
		(value: boolean) => {
			if (!result.hasNextPage) return;
			setPageSizeLocal(value ? CONSTANTS_API.pageSizeMax : pageSize);
		},
		[result.hasNextPage, pageSize],
	);

	//
	const flatData = useMemo(
		() => result?.data?.pages?.flatMap(page => page?.data?.data?.[accessDataName]).filter(Boolean) || null,
		[result.data, accessDataName],
	);
	const flatDataFirstItem = useMemo(
		() => (Object.keys(flatData?.[0] || {}).length === 0 ? null : flatData?.[0]),
		[flatData],
	);

	//
	const totals = useMemo(() => result?.data?.pages?.at(-1)?.data?.data?.totals, [result]);

	//
	return {
		...result,
		flatData,
		flatDataFirstItem,
		totals,
		handleFetchAllChange: singleItemId ? null : handleFetchAllChange,
	};
};
