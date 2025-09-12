import { Modal, Form, DatePicker, Select, InputNumber, Input, Button, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { api } from '../../lib/api';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  defaultDate?: Dayjs;
};

export default function SubmitExpenseModal({ open, onClose, onSuccess, defaultDate }: Props) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const onFinish = async (v: any) => {
    setSubmitting(true);
    try {
      await api.post('/expense', {
        date: (v.date as Dayjs).format('YYYY-MM-DD'),
        category: v.category,
        amount: v.amount,
        description: v.description,
      });
      message.success('Expense submitted');
      form.resetFields();
      onSuccess();
      onClose();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Submit Expense"
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      className="atlas-confirm"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ date: defaultDate ?? dayjs(), category: 'Internet' }}
      >
        {/* 2-up grid row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select
              options={['Internet', 'Travel', 'Meal', 'Other'].map((v) => ({ value: v, label: v }))}
            />
          </Form.Item>
        </div>

        {/* 2-up grid row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <div />
        </div>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
