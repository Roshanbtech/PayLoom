import AppShell from '../components/AppShell';
import { Outlet } from 'react-router-dom';


export default function AdminLayout() {
return (
<AppShell
menu={[
{ key: 'slips', label: 'Slips', path: '/admin/slips' },
{ key: 'expenses', label: 'Review Expenses', path: '/admin/expenses' },
{ key: 'users', label: 'Employees', path: '/admin/users' },
]}
>
<Outlet />
</AppShell>
);
}