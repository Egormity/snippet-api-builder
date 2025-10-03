import {
  TUseApiInfiniteQueryProps,
  useApiInfiniteQuery,
  useApiMutationNew,
  useApiQuery,
} from "@hooks";

import {
  NullUndefinedAble,
  RecursiveNullUndefinedPartialAble,
  RecursiveNullable,
  TGetApiMethodProp,
} from "@types";

import { UtilApiBuilder } from "@utils";

//
export type TMethodParams = NullUndefinedAble<
  RecursiveNullUndefinedPartialAble<Record<string, unknown>>
>;

//
export type TUseApiQueryMethodProp<
  TResponse = any,
  TParams extends TMethodParams = any,
  TUrlReplaceParams extends Record<string, unknown> = any
> = TGetApiMethodProp<
  typeof useApiQuery<TResponse, TParams, TUrlReplaceParams>
>;

//
export type TUseApiInfiniteQueryMethodProp<
  TDataArrayItem = any,
  TParams extends TMethodParams = any
> = TGetApiMethodProp<typeof useApiInfiniteQuery<TDataArrayItem, TParams>>;

//
export type TUseApiIMutationMethodProp<
  TData = any,
  TPromiseResponse = any,
  TParams extends TMethodParams = any,
  TUrlReplaceParams extends Record<string, unknown> = any
> = TGetApiMethodProp<
  typeof useApiMutationNew<TData, TPromiseResponse, TParams, TUrlReplaceParams>
>;

//
export type TMethodPassProps<T = any> = {
  method?: TUseApiInfiniteQueryMethodProp<T> | null;
  methodProps?: Partial<TUseApiInfiniteQueryProps<T>>;
  methodProvidedData?: NullUndefinedAble<
    { flatData: NullUndefinedAble<T[]> } & Partial<
      ReturnType<TUseApiInfiniteQueryMethodProp<T>>
    >
  >;
  formatData?: (data: NullUndefinedAble<T[]>) => NullUndefinedAble<T[]>;
  searchUrlName?: "search" | "searchSecond" | null;
  isDebounceSearchValue?: boolean;
  isSearchInput?: boolean;
};

//
export type TApiTypesBuilder<T extends UtilApiBuilder> = {
  [K in keyof T["methods"]]: T["methods"][K]["type"] extends "useApiQuery"
    ? RecursiveNullable<
        T["methods"][K]["responseDTO"] extends { data: infer D }
          ? D extends Array<infer A>
            ? A
            : D
          : T["methods"][K]["responseDTO"] extends Array<infer A>
          ? A
          : T["methods"][K]["responseDTO"]
      >
    : T["methods"][K]["type"] extends "useApiInfiniteQuery"
    ? RecursiveNullable<T["methods"][K]["responseDTOInfiniteQueryArrayInner"]>
    : T["methods"][K]["type"] extends "useApiMutation"
    ? RecursiveNullable<T["methods"][K]["mutationDTO"]>
    : never;
};
