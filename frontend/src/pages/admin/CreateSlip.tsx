import { Button, Card, Form, Input, InputNumber, Typography, message } from 'antd';
import { api } from '../../lib/api';
import EmployeeSelect from '../../components/EmployeeSelect';


export default function CreateSlip() {
const onFinish = async (v: any) => {
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
message.success('Salary slip created (email sent)');
} catch (e: any) { message.error(e?.response?.data?.message || 'Failed'); }
};


return (
<Card title="Create Salary Slip">
<Typography.Paragraph type="secondary">
Select the employee by name; no more copying IDs.
</Typography.Paragraph>
<Form layout="vertical" onFinish={onFinish} initialValues={{ month: '2025-08' }}>
<Form.Item name="employeeId" label="Employee" rules={[{ required: true }]}>
<EmployeeSelect />
</Form.Item>
<Form.Item name="month" label="Month (YYYY-MM)" rules={[{ required: true }]}>
<Input placeholder="2025-08" />
</Form.Item>
<Form.Item name="basic" label="Basic" rules={[{ required: true }]}><InputNumber style={{ width:'100%' }} min={0} /></Form.Item>
<Form.Item name="hra" label="HRA"><InputNumber style={{ width:'100%' }} min={0} /></Form.Item>
<Form.Item name="allowances" label="Allowances (sum)"><InputNumber style={{ width:'100%' }} min={0} /></Form.Item>
<Form.Item name="tax" label="Tax"><InputNumber style={{ width:'100%' }} min={0} /></Form.Item>
<Form.Item name="pf" label="PF"><InputNumber style={{ width:'100%' }} min={0} /></Form.Item>
<Form.Item name="notes" label="Notes"><Input.TextArea rows={3} /></Form.Item>
<Button type="primary" htmlType="submit">Create</Button>
</Form>
</Card>
);
}