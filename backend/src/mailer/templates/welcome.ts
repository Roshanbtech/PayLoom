import { baseLayout } from './baseLayout';

export function welcomeEmail(opts: {
  nameOrEmail: string;
  createdByAdmin?: boolean;
  tempPassword?: string;            // optional: only include for admin-created users
}) {
  const { nameOrEmail, createdByAdmin, tempPassword } = opts;

  const body = `
    <p>Hi <b style="color:#e6f4ea">${nameOrEmail}</b>,</p>
    <p>Welcome to <b style="color:#e6f4ea">PayLoom</b> — your payroll & expenses hub.</p>

    ${
      createdByAdmin
        ? `<p>Your account has been created by your administrator.</p>`
        : `<p>Your account has been created successfully.</p>`
    }

    ${
      tempPassword
        ? `<p style="margin:12px 0;padding:12px;background:#122a1e;border:1px solid #123026;border-radius:8px">
             <span style="display:inline-block;min-width:120px;color:#cdebd9">Temporary password:</span>
             <b style="color:#16a34a">${tempPassword}</b>
           </p>
           <p style="color:#93b5a2">For security, please sign in and change your password immediately.</p>`
        : ``
    }

    <p>You can now sign in to view salary slips, submit expenses, and track approvals.</p>
    <p style="margin-top:20px;">— The PayLoom Team</p>
  `;

  return {
    subject: 'Welcome to PayLoom',
    html: baseLayout('Welcome to PayLoom', body),
  };
}
