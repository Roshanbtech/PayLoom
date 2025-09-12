import { ApiError } from '../../core/error';
import { ExpensesRepo } from './repo';
import { User } from '../users/model';
import { sendMail } from '../../mailer/mailer';
import { expenseStatusEmail } from '../../mailer/templates/expenseStatus';

export const ExpensesService = {
  async submitExpense(employee: { sub: string }, payload: any) {
    return ExpensesRepo.create({ ...payload, employeeId: employee.sub, status: 'submitted' });
  },

  async listMine(employee: { sub: string }, range?: { from?: string, to?: string }) {
    const filter: any = { employeeId: employee.sub };
    if (range?.from || range?.to) {
      filter.date = {};
      if (range.from) filter.date.$gte = range.from;
      if (range.to) filter.date.$lte = range.to;
    }
    return ExpensesRepo.find(filter);
  },

  async adminUpdateStatus(admin: { role: string }, id: string, status: 'approved'|'rejected') {
    if (admin.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Admin only');
    const exp = await ExpensesRepo.updateStatus(id, status);
    if (!exp) throw new ApiError(404, 'NOT_FOUND', 'Expense not found');
    const emp = await User.findById(exp.employeeId).lean();
    if (emp) {
      const mail = expenseStatusEmail(emp.name || emp.email, exp.amount, status);
      await sendMail(emp.email, mail.subject, mail.html);
    }
    return exp;
  },

  async adminListAll(admin: { role: string }) {
    if (admin.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Admin only');
    return ExpensesRepo.findWithEmployee({});
  }
};
