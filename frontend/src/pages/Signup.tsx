import { useState } from 'react';
import { Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../ui/toast';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (v: any) => {
    if (loading) return; 
    setLoading(true);
    try {
      const name = String(v.name || '').trim();
      const email = String(v.email || '').trim();
      const password = String(v.password || '');
      await signup(name, email, password);
      toast.success('Account created. Please login.');
      form.resetFields();
      nav('/login', { replace: true });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          minWidth: '280px'
        }}
      >
        <Typography.Title
          level={3}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(18px, 4vw, 24px)',
            marginBottom: '24px'
          }}
        >
          Create your PayLoom account
        </Typography.Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          aria-busy={loading}
        >
          <Form.Item
            name="name"
            label="Full name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input
              autoComplete="name"
              disabled={loading}
              style={{ height: '40px', fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              autoComplete="email"
              disabled={loading}
              style={{ height: '40px', fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password
              autoComplete="new-password"
              disabled={loading}
              style={{ height: '40px', fontSize: '16px' }}
            />
          </Form.Item>

          {/* Optional but recommended: confirm password */}
          <Form.Item
            name="confirm"
            label="Confirm password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                }
              })
            ]}
          >
            <Input.Password
              autoComplete="new-password"
              disabled={loading}
              style={{ height: '40px', fontSize: '16px' }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}           
            disabled={loading}
            style={{ height: '40px', fontSize: '16px' }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
        </Form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/login">Back to login</Link>
        </div>
      </Card>
    </div>
  );
}
