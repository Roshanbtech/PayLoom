// src/pages/admin/Employees.tsx
import { useEffect, useState } from 'react';
import { Card, Table, Input, Button, Space } from 'antd';
import { api } from '../../lib/api';
import AddEmployeeModal from '../../components/modals/AddEmployeeModal';

type Row = { id: string; name?: string; email: string; role: 'employee' | 'admin' };

export default function Employees() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', { params: { role: 'employee', q, limit: 50 } });
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);
  useEffect(() => {
    const t = setTimeout(fetchList, 300); // debounce search
    return () => clearTimeout(t);
  }, [q]);

  return (
    <Card
      title="Employees"
      className="table-card"
      extra={
        <Space wrap>
          <Input
            placeholder="Search name/email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            allowClear
            size="middle"
            style={{ width: 220 }}
          />
          <Button type="primary" onClick={() => setAddOpen(true)}>Add Employee</Button>
        </Space>
      }
    >
      <div className="table-wrap">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={rows}
          pagination={{ pageSize: 10, responsive: true }}
          size="small"
          sticky={{ offsetHeader: 64 }}
          scroll={{ x: 720, y: 'calc(100vh - 320px)' }}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              ellipsis: true,
              render: (v: string, r) => v || <span style={{ opacity: 0.8 }}>{r.email}</span>,
            },
            { title: 'Email', dataIndex: 'email', ellipsis: true },
            // If you want to explicitly show role (even though this page lists only employees), uncomment:
            { title: 'Role', dataIndex: 'role', width: 120, responsive: ['md'] },
          ]}
        />
      </div>

      <AddEmployeeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchList}
      />
    </Card>
  );
}
