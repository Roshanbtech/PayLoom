import { Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../ui/toast';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();

  const onFinish = async (v: any) => {
    try {
      await signup(v.name, v.email, v.password);
      toast.success('Account created. Please login.');
      nav('/login');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Signup failed');
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
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="name" 
            label="Full name" 
            rules={[{ required: true }]}
          >
            <Input 
              style={{ 
                height: '40px',
                fontSize: '16px' // Prevents zoom on iOS
              }} 
            />
          </Form.Item>
          
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
            rules={[{ required: true, min: 8 }]}
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
            Create Account
          </Button>
        </Form>
        
        <div style={{ 
          marginTop: 16, 
          textAlign: 'center' 
        }}>
          <Link to="/login">Back to login</Link>
        </div>
      </Card>
    </div>
  );
}