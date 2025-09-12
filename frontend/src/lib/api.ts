// src/lib/api.ts
import axios from 'axios';
import { storage } from './storage';
import { toast } from '../ui/toast';


export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });


api.interceptors.request.use((config) => {
const token = storage.getToken();
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});


function extractErrorMessage(err: any) {
return (
err?.response?.data?.message ||
err?.response?.data?.error ||
err?.message ||
'Request failed'
);
}


api.interceptors.response.use(
(res) => res,
(err) => {
const status = err?.response?.status;


if (status === 401) {
storage.clearAll();
if (location.pathname !== '/login') location.href = '/login';
} else {
// Show a toast unless the caller explicitly asked to be silent
const silent = (err?.config as any)?.__silent;
if (!silent) toast.error(extractErrorMessage(err));
}


return Promise.reject(err);
}
);