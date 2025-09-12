import { baseLayout } from './baseLayout';

const INR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(n || 0));

export function expenseStatusEmail(nameOrEmail: string, amount: number, status: 'approved'|'rejected') {
  const prettyAmount = INR(amount);
  const body = `
    <p>Hi <b style="color:#e6f4ea">${nameOrEmail}</b>,</p>
    <p>Your expense of <b style="color:#16a34a">${prettyAmount}</b> has been
      <b style="color:${status === 'approved' ? '#16a34a' : '#ef4444'}">${status}</b>.
    </p>
    <p>You can review the details in your PayLoom dashboard.</p>
    <p style="margin-top:20px;">— The PayLoom Team</p>
  `;
  return {
    subject: `Expense ${status}`,
    html: baseLayout('Expense Status Updated', body),
  };
}
