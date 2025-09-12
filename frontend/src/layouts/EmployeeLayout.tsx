import AppShell from '../components/AppShell';
import { Outlet } from 'react-router-dom';


export default function EmployeeLayout() {
return (
<AppShell
menu={[
{ key: 'slips', label: 'My Slips', path: '/app/slips' },
{ key: 'exp', label: 'My Expenses', path: '/app/expenses' }
]}
>
<Outlet />
</AppShell>
);
}