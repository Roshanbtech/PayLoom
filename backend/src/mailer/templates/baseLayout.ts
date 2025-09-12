export function baseLayout(title: string, bodyHtml: string) {
  return `
  <div style="background:#0b1114;padding:24px">
    <div style="max-width:640px;margin:0 auto;border:1px solid #123026;border-radius:10px;overflow:hidden;background:#0f1a1c;">
      <!-- Header bar -->
      <div style="background:#16a34a;padding:16px 20px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#0b1114;">
          PayLoom
        </div>
      </div>

      <!-- Title -->
      <div style="padding:18px 20px 0 20px;">
        <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.3;color:#e6f4ea;">
          ${title}
        </h2>
      </div>

      <!-- Body -->
      <div style="padding:8px 20px 20px 20px;font-family:Arial,Helvetica,sans-serif;color:#cdebd9;line-height:1.6;font-size:14px;">
        ${bodyHtml}
      </div>

      <!-- Footer -->
      <div style="padding:14px 20px;border-top:1px solid #123026;background:#0f1a1c;color:#93b5a2;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
        This is an automated message from <b style="color:#e6f4ea">PayLoom</b>. Please do not reply.
      </div>
    </div>
  </div>`;
}
