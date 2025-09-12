// src/pages/admin/Slips.tsx
import { useEffect, useMemo, useState } from 'react';
import { Card, Table, Input, Button, Space, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { api } from '../../lib/api';
import CreateSlipModal from '../../components/modals/CreateSlipModal';

type SlipAdminRow = {
  _id: string;
  month: string; // YYYY-MM
  earnings: { basic: number; hra?: number; allowances?: { name: string; amount: number }[] };
  deductions?: { tax?: number; other?: { name: string; amount: number }[] };
  netPay: number;
  notes?: string;
  createdAt: string;
  employeeId: { _id: string; name?: string; email: string } | string;
};

export default function Slips() {
  const [rows, setRows] = useState<SlipAdminRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState('');
  const [month, setMonth] = useState<Dayjs | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [open, setOpen] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (q.trim()) params.q = q.trim();
      if (month) params.month = month.format('YYYY-MM');

      // requires backend: GET /salary-slip/admin/all (with employee populate)
      const { data } = await api.get('/salary-slip/admin/all', { params });
      setRows(data as SlipAdminRow[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); /* initial */ }, []);
  // debounce q changes
  useEffect(() => {
    const t = setTimeout(fetchList, 300);
    return () => clearTimeout(t);
  }, [q]);
  // immediate fetch for month change
  useEffect(() => { fetchList(); }, [month]);

  const data = useMemo(() => rows, [rows]);

  return (
    <Card
      title="Salary Slips"
      className="table-card"
      extra={
        <Space wrap>
          <Input
            placeholder="Search by employee name/email"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            allowClear
            size="middle"
            style={{ width: 240 }}
          />
          <DatePicker
            picker="month"
            allowClear
            value={month as any}
            onChange={(v) => { setMonth(v || null); setPage(1); }}
            placeholder="Filter by month"
            style={{ width: 170 }}
          />
          <Button type="primary" onClick={() => setOpen(true)}>Create Slip</Button>
        </Space>
      }
    >
      <div className="table-wrap">
        <Table
          className="atlas-table-green"
          rowKey="_id"
          loading={loading}
          dataSource={data}
          size="small"
          pagination={{
            current: page,
            pageSize,
            onChange: (p, ps) => { setPage(p); setPageSize(ps); },
            responsive: true,
            showSizeChanger: false,
            showTotal: (t, r) => `${r[0]}-${r[1]} of ${t}`,
          }}
          // no sticky header (per your request)
          scroll={{ x: 1000, y: 'calc(100vh - 320px)' }}
          tableLayout="auto"
          columns={[
            {
              title: 'S.No.',
              key: 'index',
              width: 80,
              render: (_: any, __: any, idx: number) => (page - 1) * pageSize + idx + 1,
            },
            {
              title: 'Employee',
              dataIndex: 'employeeId',
              width: 260,
              render: (emp: SlipAdminRow['employeeId']) => {
                if (emp && typeof emp === 'object') {
                  const primary = emp.name || emp.email;
                  return (
                    <div style={{ display: 'grid', lineHeight: 1.2 }}>
                      <strong>{primary}</strong>
                      <span style={{ opacity: 0.7, fontSize: 12 }}>{emp.email}</span>
                    </div>
                  );
                }
                return <span style={{ opacity: 0.7 }}>ID: {String(emp) || '—'}</span>;
              },
            },
            { title: 'Month', dataIndex: 'month', width: 120 },
            { title: 'Basic', dataIndex: ['earnings', 'basic'], width: 110 },
            { title: 'HRA', dataIndex: ['earnings', 'hra'], width: 100 },
            { title: 'Tax', dataIndex: ['deductions', 'tax'], width: 100 },
            { title: 'Net Pay', dataIndex: 'netPay', width: 120 },
            {
              title: 'Created',
              dataIndex: 'createdAt',
              width: 180,
              render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
              responsive: ['md'],
            },
          ]}
        />
      </div>

      <CreateSlipModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchList}
      />
    </Card>
  );
}
