import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Header, Sider, Content } = Layout;

export default function EmployeeLayout() {
  const nav = useNavigate();
  const loc = useLocation();
  const { logout, user } = useAuth();

  const key = loc.pathname.includes('/expenses/new') ? '2'
    : loc.pathname.includes('/expenses') ? '3'
    : '1';

  return (
    <Layout style={{ minHeight:'100vh' }}>
      <Sider>
        <div style={{ color:'#fff', padding:16, fontWeight:700 }}>PayLoom • {user?.name || user?.email}</div>
        <Menu theme="dark" selectedKeys={[key]} onClick={(e) => {
          if (e.key==='1') nav('/app/slips');
          // if (e.key==='2') nav('/app/expenses/new');
          if (e.key==='3') nav('/app/expenses');
          if (e.key==='logout') { logout(); nav('/login'); }
        }} items={[
          { key:'1', label:'My Slips' },
          // { key:'2', label:'Submit Expense' },
          { key:'3', label:'My Expenses' },
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
