import { Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../ui/toast';
import { storage } from '../lib/storage';

export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();

  const onFinish = async (v: any) => {
    try {
      await login(v.email, v.password);
      const user = storage.getUser();
      toast.success(`Hello ${user?.name}, welcome back!`);
      // redirect by role
      const role = (JSON.parse(localStorage.getItem('payloom_user') || '{}') as any)?.role;
      nav(role === 'admin' ? '/admin' : '/app', { replace: true });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Login failed');
    }
  };

  if (user) { 
    const to = user.role === 'admin' ? '/admin' : '/app';
    return <Navigate to={to} replace />;
  }

  return (
    <div 
      className="container" 
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
          maxWidth: '400px',
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
          PayLoom Login
        </Typography.Title>
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="email" 
            label="Email" 
            rules={[{ required: true, type: 'email' }]}
          >
            <Input 
              style={{ 
                height: '40px',
                fontSize: '16px' // Prevents zoom on iOS
              }} 
            />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            label="Password" 
            rules={[{ required: true }]}
          >
            <Input.Password 
              style={{ 
                height: '40px',
                fontSize: '16px' // Prevents zoom on iOS
              }} 
            />
          </Form.Item>
          
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            style={{ 
              height: '40px',
              fontSize: '16px'
            }}
          >
            Login
          </Button>
        </Form>
        
        <div style={{ 
          marginTop: 16, 
          textAlign: 'center' 
        }}>
          <Link to="/signup">New here? Sign up</Link>
        </div>
      </Card>
    </div>
  );
}