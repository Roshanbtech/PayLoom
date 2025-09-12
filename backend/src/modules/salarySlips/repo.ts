import { SalarySlip } from './model';
import { FilterQuery } from 'mongoose';

export const SlipsRepo = {
  create: (doc: any) => SalarySlip.create(doc),
  updateById: (id: string, patch: any) => SalarySlip.findByIdAndUpdate(id, patch, { new: true }),
  find: (filter: FilterQuery<any>) => SalarySlip.find(filter).sort({ createdAt: -1 }),
  findById: (id: string) => SalarySlip.findById(id),
   findWithEmployee: (filter: FilterQuery<any>) =>
    SalarySlip.find(filter)
      .populate('employeeId', 'name email role') 
      .sort({ createdAt: -1 })
};
