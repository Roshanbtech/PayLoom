import { baseLayout } from './baseLayout';

export function slipCreatedEmail(nameOrEmail: string, month: string) {
  const body = `
    <p>Hi <b style="color:#e6f4ea">${nameOrEmail}</b>,</p>
    <p>Your salary slip for <b style="color:#16a34a">${month}</b> has been generated.</p>
    <p>Log in to your PayLoom dashboard to view or download the PDF.</p>
    <p style="margin-top:20px;">— The PayLoom Team</p>
  `;
  return {
    subject: `Salary Slip for ${month}`,
    html: baseLayout('Salary Slip Created', body),
  };
}
