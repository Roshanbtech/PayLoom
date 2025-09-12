import { Typography } from 'antd';


export default function Brand({ collapsed }: { collapsed?: boolean }) {
return (
<div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16 }}>
<img src="/payloom-icon.svg" alt="PayLoom" width={collapsed ? 24 : 28} height={collapsed ? 24 : 28} />
{!collapsed && (
<Typography.Text style={{ color: '#16a34a', fontWeight: 800, letterSpacing: 0.5, fontSize: 18 }}>
PayLoom
</Typography.Text>
)}
</div>
);
}