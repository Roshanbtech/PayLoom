import { Button, Card, DatePicker, Form, Input, InputNumber, message, Select } from 'antd';
import dayjs from 'dayjs';
import { api } from '../../lib/api';

export default function SubmitExpense() {
  const onFinish = async (v: any) => {
    try {
      await api.post('/expense', {
        date: (v.date as dayjs.Dayjs).format('YYYY-MM-DD'),
        category: v.category,
        amount: v.amount,
        description: v.description
      });
      message.success('Expense submitted');
    } catch (e: any) { message.error(e?.response?.data?.message || 'Failed'); }
  };

  return (
    <Card title="Submit Expense">
      <Form layout="vertical" onFinish={onFinish} initialValues={{ category:'Internet' }}>
        <Form.Item name="date" label="Date" rules={[{ required: true }]}><DatePicker style={{ width:'100%' }} /></Form.Item>
        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select options={['Internet','Travel','Meal','Other'].map(v=>({value:v, label:v}))}/>
        </Form.Item>
        <Form.Item name="amount" label="Amount" rules={[{ required: true }]}><InputNumber min={0} style={{ width:'100%' }} /></Form.Item>
        <Form.Item name="description" label="Description"><Input.TextArea rows={3} /></Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form>
    </Card>
  );
}
