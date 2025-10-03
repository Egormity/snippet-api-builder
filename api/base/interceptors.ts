import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { axiosWithAuth } from "@api";

import { CONSTANTS_API } from "@constants";

import {
  utilApiUpdateAuthTokens,
  utilLocalStorage,
  utilReplaceToAuth,
} from "@utils";

// Интерцептор запросов – добавляем accessToken, если он есть
axiosWithAuth.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = utilLocalStorage.getItem("ACCESS_TOKEN");
    if (accessToken && config.headers)
      config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error: AxiosError) => error
);

// Response interceptor to handle blob/JSON conversion
axiosWithAuth.interceptors.response.use(
  // For successful responses, keep as blob
  (response) => response,
  (error: AxiosError) => {
    return new Promise((_, reject) => {
      if (
        !error.response ||
        !error.config ||
        !(error.response.data instanceof Blob)
      )
        reject(error);
      const reader = new FileReader();
      reader.onload = () => {
        error.response?.data &&
          (error.response.data = JSON.parse(reader?.result?.toString() || ""));
        reject(error);
      };
      reader.onerror = () => {
        reject(error);
      };
      reader.readAsText(error.response?.data as Blob);
    });
  }
);

// Response interceptor to handle arrayBuffer/JSON conversion
axiosWithAuth.interceptors.response.use(
  // For successful responses, keep as arrayBuffer
  (response) => response,
  (error: AxiosError) => {
    // Convert arrayBuffer error responses to JSON
    if (
      error.response &&
      error.config?.responseType === "arraybuffer" &&
      error.response.data instanceof ArrayBuffer
    ) {
      return new Promise((_, reject) => {
        try {
          if (!error.response?.data) return;
          const decoder = new TextDecoder("utf8");
          const jsonString = decoder.decode(error.response.data as ArrayBuffer);
          error.response.data = JSON.parse(jsonString);
          reject(error);
        } catch (error) {
          reject(error);
        }
      });
    }
    throw error;
  }
);

// --- Механизм обновления токена ---
// Глобальная переменная для хранения промиса обновления токена
// Интерцептор ответов – обрабатываем 401, выполняем refresh, повторяем запрос
const requestsCount: Record<string, number> = {};

//
axiosWithAuth.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Сетевая ошибка или иная проблема без ответа от сервера
    if (!error.response) throw error;

    // Обрабатываем 401
    const status = error.response.status;
    const isUnauthorized = status === 401;
    if (!isUnauthorized) throw error;

    //
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // Если ошибка произошла на запросе обновления токена — больше не пытаемся
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      console.log(
        "[axiosWithAuth]: Ошибка на refresh-token, переход в авторизацию"
      );
      utilReplaceToAuth();
      throw error;
    }

    //
    const key = `${originalRequest.url}/${originalRequest.method}`;
    const value = requestsCount[key] || 0;
    if (value >= CONSTANTS_API.maxRetries) {
      utilReplaceToAuth();
      throw error;
    }

    //
    const newToken = await utilApiUpdateAuthTokens();

    // Увеличиваем счетчик попыток и обновляем заголовок для оригинального запроса
    if (typeof requestsCount[key] === "number") requestsCount[key] += 1;
    else requestsCount[key] = 1;

    // Повторяем исходный запрос
    if (originalRequest.headers)
      originalRequest.headers.Authorization = `Bearer ${newToken?.accessToken}`;
    const res = await axiosWithAuth.request(originalRequest);

    //
    if (requestsCount) requestsCount[key] = 0;
    return res;
  }
);

//
export {};
