import { ApiError } from '../../core/error';
import { SlipsRepo } from './repo';
import { User } from '../users/model';
import { sendMail } from '../../mailer/mailer';
import { slipCreatedEmail } from '../../mailer/templates/slipCreated';

function sum(list?: { amount: number }[]) { return (list || []).reduce((a,b)=>a + (b.amount||0), 0); }
function earningsTotal(e: any) { return (e.basic||0) + (e.hra||0) + sum(e.allowances); }
function deductionsTotal(d: any) { return (d?.tax||0) + sum(d?.other); }

export const SlipsService = {
  async createSlip(admin: { sub: string; role: string }, payload: any) {
  if (admin.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Admin only');
  const netPay = earningsTotal(payload.earnings) - deductionsTotal(payload.deductions);
  const slip = await SlipsRepo.create({ ...payload, netPay, createdBy: admin.sub });

  const emp = await User.findById(payload.employeeId).lean();
  if (emp) {
    const mail = slipCreatedEmail(emp.name || emp.email, payload.month);
    await sendMail(emp.email, mail.subject, mail.html);
  }
  return slip;
},
  async updateSlip(admin: { role: string }, id: string, patch: any) {
    if (admin.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Admin only');
    if (patch.earnings || patch.deductions) {
      const netPay = earningsTotal(patch.earnings || { basic: 0, allowances: [] }) - deductionsTotal(patch.deductions || {});
      patch.netPay = netPay;
    }
    const doc = await SlipsRepo.updateById(id, patch);
    if (!doc) throw new ApiError(404, 'NOT_FOUND', 'Slip not found');
    return doc;
  },
  async listMySlips(employeeId: string, month?: string) {
    const filter: any = { employeeId };
    if (month) filter.month = month;
    return SlipsRepo.find(filter);
  },
  async getByIdForEmployee(employeeId: string, id: string) {
    const doc = await SlipsRepo.findById(id);
    if (!doc) throw new ApiError(404, 'NOT_FOUND', 'Slip not found');
    if (doc.employeeId.toString() !== employeeId) throw new ApiError(403, 'FORBIDDEN', 'Not your slip');
    return doc;
  },
  async adminListAll(admin: { role: string }, query: { month?: string; employeeId?: string; q?: string }) {
    if (admin.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Admin only');

    const { month, employeeId, q } = query || {};
    const filter: any = {};
    if (month) filter.month = month;
    if (employeeId) filter.employeeId = employeeId;

    // get slips with employee populated
    const rows = await SlipsRepo.findWithEmployee(filter);

    // optional search on employee name/email (post-filter for simplicity)
    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      return rows.filter((r: any) => {
        const emp = r.employeeId as any;
        return (
          (emp?.name || '').toLowerCase().includes(term) ||
          (emp?.email || '').toLowerCase().includes(term)
        );
      });
    }
    return rows;
  },
};
