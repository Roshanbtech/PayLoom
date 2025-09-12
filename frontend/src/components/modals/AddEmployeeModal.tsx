import { Modal, Form, Input, Select, Button } from 'antd';
import { useState } from 'react';
import { api } from '../../lib/api';
import { toast } from '../../ui/toast';

export default function AddEmployeeModal({
  open, onClose, onSuccess,
}: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (v: any) => {
    setSubmitting(true);
    try {
      await api.post('/auth/signup', { name: v.name, email: v.email, password: v.password, role: v.role });
      toast.success('User created');
      onSuccess();
      onClose();
    } catch { /* interceptor toasts */ }
    finally { setSubmitting(false); }
  };

  return (
    <Modal title="Add User" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form layout="vertical" onFinish={onFinish} initialValues={{ role: 'employee' }}>
        <Form.Item name="name" label="Full name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type:'email' }]}><Input /></Form.Item>
        <Form.Item name="password" label="Temp Password" rules={[{ required: true, min:8 }]}><Input.Password /></Form.Item>
        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select options={[{value:'employee', label:'Employee'},{value:'admin', label:'Admin'}]} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting} block>Create User</Button>
      </Form>
    </Modal>
  );
}
