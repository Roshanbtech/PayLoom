// src/components/EmployeeSelect.tsx
import { Select, Spin } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api';

export type EmployeeLite = { id: string; name?: string; email: string };

export default function EmployeeSelect({
  value, onChange,
}: { value?: string; onChange?: (v: string | undefined) => void }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<EmployeeLite[]>([]);
  const tRef = useRef<number | undefined>(undefined);

  const options = useMemo(
    () => items.map(e => ({ value: e.id, label: e.name ? `${e.name} (${e.email})` : e.email })),
    [items]
  );

  const fetchList = async (q = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', { params: { role: 'employee', q, limit: 20 } });
      setItems(data as EmployeeLite[]);
    } finally { setLoading(false); }
  };

  const onSearch = (q: string) => {
    clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => fetchList(q), 250);
  };

  useEffect(() => { if (!items.length) fetchList(''); }, []); // prefill

  // Resolve label for preset value (edit flows)
  useEffect(() => {
    const has = value && items.some(i => i.id === value);
    if (value && !has) {
      (async () => {
        try {
          const { data } = await api.get(`/users/${value}`);
          setItems(prev => prev.some(p => p.id === data.id) ? prev : [data, ...prev]);
        } catch {}
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Select
      showSearch
      allowClear
      placeholder="Select employee by name/email"
      filterOption={false}
      onSearch={onSearch}
      options={options}
      optionLabelProp="label"
      loading={loading}
      value={value}
      onChange={(v) => onChange?.(v)}
      notFoundContent={loading ? <Spin size="small" /> : 'No employees found'}
      style={{ width: '100%' }}
      getPopupContainer={(trigger) => trigger.parentElement!}
    />
  );
}
