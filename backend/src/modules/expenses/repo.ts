import { Expense } from './model';
import { FilterQuery } from 'mongoose';

export const ExpensesRepo = {
  create: (doc: any) => Expense.create(doc),

  find: (filter: FilterQuery<any>) =>
    Expense.find(filter).sort({ createdAt: -1 }),

  findWithEmployee: (filter: FilterQuery<any>) =>
    Expense.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: 'employeeId', select: 'name email' })
      .lean(),

  updateStatus: (id: string, status: 'approved'|'rejected') =>
    Expense.findByIdAndUpdate(id, { status }, { new: true }),

  findById: (id: string) => Expense.findById(id)
};
