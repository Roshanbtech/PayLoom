// src/components/modals/CreateSlipModal.tsx
import { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Row, Col } from 'antd';
import { api } from '../../lib/api';
import { toast } from '../../ui/toast';
import EmployeeSelect from '../EmployeeSelect';

export default function CreateSlipModal({
  open, onClose, onSuccess, employeeId,
}: { open: boolean; onClose: () => void; onSuccess: () => void; employeeId?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Ensure employeeId + defaults are set each time the modal opens
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ month: '2025-08', employeeId });
    }
  }, [open, employeeId, form]);

  const onFinish = async (v: any) => {
    setSubmitting(true);
    try {
      const payload = {
        employeeId: v.employeeId,
        month: v.month, // YYYY-MM
        earnings: {
          basic: v.basic,
          ...(v.hra ? { hra: v.hra } : {}),
          ...(v.allowances ? { allowances: [{ name: 'Other', amount: v.allowances }] } : {})
        },
        deductions: {
          ...(v.tax ? { tax: v.tax } : {}),
          ...(v.pf ? { other: [{ name: 'PF', amount: v.pf }] } : {})
        },
        ...(v.notes ? { notes: v.notes } : {})
      };
      await api.post('/salary-slip', payload);
      toast.success('Salary slip created (email sent)');
      onSuccess();
      onClose();
    } catch {
      /* interceptor toasts handle errors */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Create Salary Slip"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* Row 1: Employee (full width for clarity) */}
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Form.Item name="employeeId" label="Employee" rules={[{ required: true }]}>
              <EmployeeSelect />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: Month | Basic */}
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Form.Item name="month" label="Month (YYYY-MM)" rules={[{ required: true }]}>
              <Input placeholder="2025-08" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="basic" label="Basic" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: HRA | Allowances */}
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Form.Item name="hra" label="HRA">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="allowances" label="Allowances (sum)">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: Tax | PF */}
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Form.Item name="tax" label="Tax">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="pf" label="PF">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Notes (full width) */}
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit" loading={submitting} block>
          Create Slip
        </Button>
      </Form>
    </Modal>
  );
}
