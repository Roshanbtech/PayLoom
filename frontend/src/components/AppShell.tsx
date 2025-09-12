// src/components/AppShell.tsx
import { Layout, Menu, Button, Dropdown, Avatar, Typography, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Brand from './Brand';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../ui/toast';  


const { Header, Sider, Content } = Layout;


export type ShellItem = { key: string; label: string; path?: string; onClick?: () => void };


export default function AppShell({ menu, children }: { menu: ShellItem[]; children: React.ReactNode }) {
const [collapsed, setCollapsed] = useState(false);
const { user, logout } = useAuth();
const nav = useNavigate();
const loc = useLocation();


const selectedKeys = useMemo(() => {
const hit = menu.find((m) => (m.path ? loc.pathname.startsWith(m.path) : loc.pathname.includes(m.key)));
return [hit?.key ?? menu[0].key];
}, [loc.pathname, menu]);


return (
<Layout>
<Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={240}>
<Brand collapsed={collapsed} />
<Menu
theme="dark"
mode="inline"
selectedKeys={selectedKeys}
onClick={({ key }) => {
const it = menu.find((i) => i.key === key);
if (!it) return;
if (it.onClick) it.onClick();
else if (it.path) nav(it.path);
}}
items={menu.map((m) => ({ key: m.key, label: m.label }))}
/>
</Sider>


<Layout>
<Header style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--payloom-elev)' }}>
<Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />


<div style={{ marginLeft: 'auto' }} />


<Dropdown
trigger={['click']}
menu={{
items: [
{ key: 'name', label: <span><b>{user?.name || '—'}</b> <Typography.Text type="secondary">({user?.role})</Typography.Text></span> },
{ type: 'divider' },
{ key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: () => {
          const who = user?.name || user?.email || 'there';  
          toast.success(`Signed out. See you soon, ${who}!`);
          logout();
          nav('/login', { replace: true });
        } }
]
}}
>
<Space style={{ cursor: 'pointer' }}>
<Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: '#16a34a' }} />
<Typography.Text strong>{user?.name || user?.email}</Typography.Text>
</Space>
</Dropdown>
</Header>


<Content style={{ padding: 24 }} className="brand-gradient">
{children}
</Content>
</Layout>
</Layout>
);
}