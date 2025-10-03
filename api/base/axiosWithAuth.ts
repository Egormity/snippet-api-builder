import axios, { AxiosInstance } from "axios";

import { CONSTANTS_API } from "@constants";

export const axiosWithAuth: AxiosInstance = axios.create({
	baseURL: CONSTANTS_API.baseUrl,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});
