// src/hooks/useEmployees.ts
import { useEffect, useState } from 'react';
import { api } from '../lib/api';


export type EmployeeLite = { id: string; name?: string; email: string };


export function useEmployees(initialQuery = '') {
const [loading, setLoading] = useState(false);
const [items, setItems] = useState<EmployeeLite[]>([]);


const fetchList = async (q = initialQuery) => {
setLoading(true);
try {
// Adjust this endpoint if your backend differs
const { data } = await api.get('/users', { params: { role: 'employee', q } });
// Expecting array of { id, name, email }
setItems(data);
} finally { setLoading(false); }
};


useEffect(() => { fetchList(); }, []);


return { items, loading, reload: fetchList };
}