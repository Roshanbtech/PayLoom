import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const nav = useNavigate();
  const loc = useLocation();
  const { logout } = useAuth();

  const selected = loc.pathname.includes('/expenses') ? '2'
    : loc.pathname.includes('/users') ? '3'
    : '1';

  return (
    <Layout style={{ minHeight:'100vh' }}>
      <Sider>
        <div style={{ color:'#fff', padding:16, fontWeight:700 }}>PayLoom Admin</div>
        <Menu theme="dark" selectedKeys={[selected]} onClick={(e) => {
          if (e.key==='1') nav('/admin/slips/create');
          if (e.key==='2') nav('/admin/expenses');
          if (e.key==='3') nav('/admin/users');
          if (e.key==='logout') { logout(); nav('/login'); }
        }} items={[
          { key:'1', label:'Create Slip' },
          { key:'2', label:'Review Expenses' },
          { key:'3', label:'Add Employee' },
          { key:'logout', label:'Logout' }
        ]}/>
      </Sider>
      <Layout>
        <Header style={{ background:'#fff' }} />
        <Content style={{ padding:24 }}><Outlet /></Content>
      </Layout>
    </Layout>
  );
}
