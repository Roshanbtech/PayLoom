import { useEffect, useState } from 'react';
import { Table, Card, Tag, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { api } from '../../lib/api';
import type { Expense } from '../../types';
import SubmitExpenseModal from '../../components/modals/SubmitExpenseModal';

const INR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n ?? 0);

export default function MyExpenses() {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/expense');
      setData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <Card
      title="My Expenses"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          New Expense
        </Button>
      }
      className="table-card"
    >
      <Table
        className="atlas-table-green"
        rowKey="_id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 8, responsive: true }}
        size="small"
        scroll={{ x: 720 }}
        columns={[
          { title: 'S.No.', key: 'index', width: 70, render: (_: any, __: any, idx: number) => idx + 1 },
          { title: 'Date', dataIndex: 'date', render: (d: string) => dayjs(d).format('YYYY-MM-DD') },
          { title: 'Category', dataIndex: 'category' },
          { title: 'Amount', dataIndex: 'amount', render: (v: number) => INR(v) },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (s) => (
              <Tag color={s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'gold'}>{s}</Tag>
            ),
          },
          {
            title: 'Created',
            dataIndex: 'createdAt',
            render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
          },
        ]}
      />

      <SubmitExpenseModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchData}
        defaultDate={dayjs()}
      />
    </Card>
  );
}
