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

  // pagination state for S.No.
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    const t = setTimeout(() => { setPage(1); fetchList(); }, 300);
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
        <Table<Row>
          className="atlas-table-green"
          rowKey="id"
          loading={loading}
          dataSource={rows}
          size="small"
          pagination={{
            current: page,
            pageSize,
            onChange: (p, ps) => { setPage(p); setPageSize(ps); },
            showSizeChanger: false,
            responsive: true,
          }}
          // removed sticky to avoid header overlap
          // sticky={{ offsetHeader: 64 }}
          scroll={{ x: 720, y: 'calc(100vh - 320px)' }}
          columns={[
            {
              title: 'S.No.',
              key: 'index',
              width: 80,
              render: (_: any, __: Row, idx: number) => (page - 1) * pageSize + idx + 1,
            },
            {
              title: 'Name',
              dataIndex: 'name',
              ellipsis: true,
              render: (v: string | undefined, r) =>
                v ? v : <span style={{ opacity: 0.8 }}>{r.email}</span>,
            },
            { title: 'Email', dataIndex: 'email', ellipsis: true },
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
