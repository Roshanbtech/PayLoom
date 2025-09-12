// src/pages/employee/MySlips.tsx
import { useEffect, useState, useMemo } from 'react';
import { Table, Card, DatePicker, Tooltip, App } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { api } from '../../lib/api';
import type { SalarySlip } from '../../types';
import { toast } from '../../ui/toast';

export default function MySlips() {
  const [data, setData] = useState<SalarySlip[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState<string | undefined>(undefined);

  const { message } = App.useApp();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/salary-slip', { params: month ? { month } : {} });
      setData(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, [month]);

  const currency = (n?: number) =>
    typeof n === 'number' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n) : '—';

  const filtered = useMemo(() => data, [data]); 

  const downloadPdf = async (row: SalarySlip) => {
    try {
      const res = await api.get(`/salary-slip/${row._id}/pdf`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `salary-slip-${row.month}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.info('Downloading PDF…');
    } catch {
      message.error('Failed to download');
    }
  };

  return (
    <Card
      title="My Salary Slips"
      className="table-card"
      extra={
        <DatePicker
          picker="month"
          allowClear
          onChange={(v) => setMonth(v ? v.format('YYYY-MM') : undefined)}
          placeholder="Filter by month"
          style={{ width: 170 }}
        />
      }
      styles={{ body: { padding: 16 } }}
    >
      <div className="table-wrap">
        <Table
          className="atlas-table-green"
          rowKey="_id"
          loading={loading}
          dataSource={filtered}
          pagination={{ pageSize: 8, responsive: true }}
          size="small"
          // smooth on small screens
          scroll={{ x: 860, y: 'calc(100vh - 320px)' }}
          columns={[
            { title: 'S.No.', key: 'index', width: 70, render: (_: any, __: any, idx: number) => idx + 1 },
            { title: 'Month', dataIndex: 'month', width: 120 },
            { title: 'Basic', dataIndex: ['earnings','basic'], width: 120, render: (v: number) => currency(v) },
            { title: 'HRA', dataIndex: ['earnings','hra'], width: 120, render: (v: number) => currency(v) },
            { title: 'Tax', dataIndex: ['deductions','tax'], width: 120, render: (v: number) => currency(v) },
            {
              title: 'Created',
              dataIndex: 'createdAt',
              width: 180,
              render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
            },
            {
              title: 'PDF',
              key: 'pdf',
              fixed: 'right',
              width: 80,
              align: 'center' as const,
              render: (_, r) => (
                <Tooltip title="Download PDF">
                  <button
                    onClick={() => downloadPdf(r)}
                    aria-label="Download PDF"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--payloom-primary)',
                      cursor: 'pointer',
                      padding: 4,
                      lineHeight: 0
                    }}
                  >
                    <FilePdfOutlined style={{ fontSize: 18 }} />
                  </button>
                </Tooltip>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
}
