// src/context/AuthContext.tsx
import { createContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { storage } from '../lib/storage';
import type { StoredUser } from '../lib/storage';


export type AuthCtx = {
user: StoredUser | null;
token: string | null;
loading: boolean;
login: (email: string, password: string) => Promise<void>;
logout: () => void;
signup: (name: string, email: string, password: string) => Promise<void>;
};


export const AuthContext = createContext<AuthCtx>({
user: null, token: null, loading: true,
login: async () => {}, logout: () => {}, signup: async () => {}
});


export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<StoredUser | null>(storage.getUser());
const [token, setToken] = useState<string | null>(storage.getToken());
const [loading, setLoading] = useState(true);


useEffect(() => { setLoading(false); }, []);


const login = async (email: string, password: string) => {
const { data } = await api.post('/auth/login', { email, password });
const u: StoredUser = data.user;
storage.setToken(data.token);
storage.setUser(u);
setUser(u);
setToken(data.token);
};


const signup = async (name: string, email: string, password: string) => {
await api.post('/auth/signup', { name, email, password });
};


const logout = () => {
storage.clearAll();
setUser(null);
setToken(null);
};


const value = useMemo(() => ({ user, token, loading, login, logout, signup }), [user, token, loading]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}