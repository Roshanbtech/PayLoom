import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button, Card, Space, App, Tooltip, DatePicker } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import { api } from '../../lib/api';
import { toast } from '../../ui/toast';
import type { ExpenseAdminRow } from '../../types';

export default function ExpensesReview() {
  const [data, setData] = useState<ExpenseAdminRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState<Dayjs | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { modal } = App.useApp();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/expense/admin/all');
      setData(data as ExpenseAdminRow[]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => {
    if (!month) return data;
    const mm = month.format('YYYY-MM');
    return data.filter(r => (r.date || '').startsWith(mm));
  }, [data, month]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/expense/admin/${id}/status`, { status });
      toast.success(`Marked ${status}`);
      fetchAll();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const confirmChange = (row: ExpenseAdminRow, status: 'approved' | 'rejected') => {
    modal.confirm({
      className: 'atlas-confirm',
      title: `${status === 'approved' ? 'Approve' : 'Reject'} Expense`,
      icon: <ExclamationCircleOutlined style={{ color: 'var(--payloom-primary)' }} />,
      content: (
        <div style={{ display: 'grid', gap: 8 }}>
          <span>Are you sure you want to <b>{status}</b> this expense?</span>
          <div
            style={{
              marginTop: 4,
              padding: 12,
              background: 'var(--payloom-elev)',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div><b>Category:</b> {row.category}</div>
            <div><b>Amount:</b> {row.amount}</div>
            <div><b>Date:</b> {row.date}</div>
          </div>
        </div>
      ),
      okText: status === 'approved' ? 'Approve' : 'Reject',
      okButtonProps: status === 'approved' ? { type: 'primary' } : { type: 'text', danger: true },
      cancelButtonProps: { type: 'text' },
      onOk: () => updateStatus(row._id, status),
    });
  };

  const statusTag = (s: ExpenseAdminRow['status']) =>
    <Tag color={s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'gold'}>{s}</Tag>;

  return (
    <Card
      title="Review Expenses"
      extra={
        <Space>
          <DatePicker
            picker="month"
            allowClear
            value={month as any}
            onChange={(v) => { setMonth(v); setPage(1); }}
            placeholder="Filter by month"
            style={{ width: 170 }}
          />
        </Space>
      }
      styles={{ body: { padding: 16 } }}
    >
      <Table
        className="atlas-table-green"   // ✅ apply class here
        rowKey="_id"
        loading={loading}
        dataSource={filtered}
        size="small"
        pagination={{
          current: page,
          pageSize,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
          showSizeChanger: false,
          responsive: true,
          showTotal: (t, r) => `${r[0]}-${r[1]} of ${t}`,
        }}
        // sticky={{ offsetHeader: 64 }}
        scroll={{ x: 980, y: 'calc(100vh - 320px)' }}
        tableLayout="auto"
        columns={[
          {
            title: 'S.No.',
            key: 'index',
            width: 70,
            render: (_: any, __: any, idx: number) => (page - 1) * pageSize + idx + 1,
          },
          { title: 'Date', dataIndex: 'date', ellipsis: true, width: 120 },
          {
            title: 'User',
            dataIndex: 'employeeId',
            width: 260,
            render: (emp: ExpenseAdminRow['employeeId']) => {
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
          { title: 'Category', dataIndex: 'category', width: 120, ellipsis: true },
          { title: 'Amount', dataIndex: 'amount', width: 100 },
          { title: 'Status', dataIndex: 'status', render: statusTag, width: 120 },
          {
            title: 'Action',
            fixed: 'right',
            width: 140,
            render: (_, r) => {
              const disabled = r.status !== 'submitted';
              return (
                <Space>
                  <Tooltip title="Approve">
                    <Button
                      size="small"
                      shape="circle"
                      type="text"
                      icon={<CheckCircleFilled style={{ fontSize: 18 }} />}
                      disabled={disabled}
                      style={{ color: disabled ? 'rgba(255,255,255,.25)' : 'var(--payloom-primary)' }}
                      onClick={() => confirmChange(r, 'approved')}
                      aria-label="Approve"
                    />
                  </Tooltip>
                  <Tooltip title="Reject">
                    <Button
                      size="small"
                      shape="circle"
                      type="text"
                      danger
                      icon={<CloseCircleFilled style={{ fontSize: 18 }} />}
                      disabled={disabled}
                      onClick={() => confirmChange(r, 'rejected')}
                      aria-label="Reject"
                    />
                  </Tooltip>
                </Space>
              );
            },
          },
        ]}
      />
    </Card>
  );
}
