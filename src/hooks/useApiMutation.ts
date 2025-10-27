import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";

import { axiosWithAuth } from "../apiBase";

import {
	NullUndefinedAble,
	NullUndefinedBooleanAble,
	RecursiveNullUndefinedAble,
	RecursiveNullUndefinedPartialAble,
	TMethodParams,
} from "../types";

import { TUtilHandleServiceErrorProps, utilGetAppInfo, utilHandleServiceError } from "../utils";

//
type TGetFormattedData<
	TData,
	TUrlReplaceParams extends Record<string, unknown>
> = (TData extends NonNullable<unknown> ? { METHOD_DATA: TData } : { METHOD_DATA?: unknown }) &
	(TUrlReplaceParams extends Record<string, unknown>
		? { URL_REPLACE_PARAMS: Required<RecursiveNullUndefinedAble<TUrlReplaceParams>> }
		: { URL_REPLACE_PARAMS?: Record<string, unknown> });

//
export type TUseApiMutationProps<
	TData = any,
	TPromiseResponse = any,
	TParams extends TMethodParams = any,
	TUrlReplaceParams extends Record<string, unknown> = any
> = {
	method?: "post" | "put" | "patch" | "delete";
	url: string;
	mutationKey: Array<unknown>;
	config?: AxiosRequestConfig<unknown>;
	params?: NullUndefinedAble<RecursiveNullUndefinedPartialAble<TParams>>;
	onSuccessInvalidateQueryKeys?: NullUndefinedAble<Array<Array<string>>>;
	onSuccess?: (
		data: AxiosResponse<TPromiseResponse>,
		variables: TGetFormattedData<TData, TUrlReplaceParams>,
		context: unknown
	) => void;
	onError?: (error: Error, variables: TGetFormattedData<TData, TUrlReplaceParams>, context: unknown) => void;
	utilHandleServiceErrorProps?: NullUndefinedAble<Omit<Partial<TUtilHandleServiceErrorProps>, "error">>;
	successMessage?: NullUndefinedBooleanAble<string>;
	isSuccessMessage?: boolean;
	getMethodData?: TData extends NullUndefinedAble<Record<string, unknown>>
		? () => TData | Promise<TData>
		: never;
};

//
export const useApiMutation = <
	TData = any,
	TPromiseResponse = any,
	TParams extends TMethodParams = any,
	TUrlReplaceParams extends Record<string, unknown> = any
>({
	method = "post",
	url,
	mutationKey,
	config,
	params,
	onSuccessInvalidateQueryKeys,
	onSuccess,
	onError,
	utilHandleServiceErrorProps,
	successMessage = "Успешно!",
	isSuccessMessage = utilGetAppInfo().isAdmin,
	getMethodData,
}: TUseApiMutationProps<TData, TPromiseResponse, TParams, TUrlReplaceParams>) => {
	const queryClient = useQueryClient();
	const [replaceData, setReplaceData] = useState<unknown[]>([]);

	//
	return useMutation({
		mutationKey,
		mutationFn: async data => {
			try {
				const urlFormatted: string = (() => {
					if (!!data && typeof data === "object" && "URL_REPLACE_PARAMS" in data) {
						const urToReplaceObj = data.URL_REPLACE_PARAMS;
						delete (data as Record<string, unknown>)["URL_REPLACE_PARAMS"];
						if (!!urToReplaceObj && typeof urToReplaceObj === "object") {
							let newUrl = url;
							for (const [key, value] of Object.entries(urToReplaceObj)) {
								newUrl = newUrl.replace(`:${key}`, (value as string) + "");
							}
							setReplaceData(Object.values(urToReplaceObj).filter(Boolean));
							return newUrl;
						}
					}
					return url;
				})();

				//
				const extractedData = (() => {
					if (!!data && typeof data === "object" && "METHOD_DATA" in data) return data["METHOD_DATA"];
					return data;
				})();
				const queryMethodData = await getMethodData?.();
				const formattedData = (() => {
					if (!!extractedData && typeof extractedData === "object" && !Array.isArray(extractedData)) {
						const d = { ...extractedData, ...queryMethodData };
						Object.keys(d).forEach(key => {
							if (key.startsWith("DEVELOP_") || key.startsWith("IS_DEVELOP"))
								delete (d as Record<string, unknown>)[key];
						});
						return d;
					}
					return extractedData;
				})();

				//
				const paramsFormatted = { ...(config?.params as object | undefined), ...params };

				//
				const response = await (method === "delete"
					? axiosWithAuth.delete<TPromiseResponse>(urlFormatted, {
							...config,
							params: paramsFormatted,
							data: formattedData,
					  })
					: axiosWithAuth[method]<TPromiseResponse>(urlFormatted, formattedData, {
							...config,
							params: paramsFormatted,
					  }));
				if (!response) throw new Error();

				//
				isSuccessMessage && successMessage && alert(successMessage);
				return response;
			} catch (error: unknown) {
				throw utilHandleServiceError({
					error,
					...utilHandleServiceErrorProps,
					isToast: utilHandleServiceErrorProps?.isToast,
				});
			}
		},
		onSuccess: (data, variables, context) => {
			[...replaceData.map(el => [el]), ...(onSuccessInvalidateQueryKeys || [])].forEach(keyArr => {
				queryClient.invalidateQueries({ queryKey: keyArr }).catch(console.log);
			});
			onSuccess?.(data, variables, context);
		},
		onError,
	});
};
