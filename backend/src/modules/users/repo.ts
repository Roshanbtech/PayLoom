import { FilterQuery } from 'mongoose';
import { User } from './model';

export const UsersRepo = {
  // Existing auth-related methods (keep as-is)
  findByEmail: (email: string) => User.findOne({ email }).exec(),
  create: (doc: any) => User.create(doc),
  upsertByEmail: (email: string, patch: any) =>
    User.findOneAndUpdate({ email }, { $set: patch }, { upsert: true, new: true }).exec(),

  // NEW: Lite list for admin pickers (EmployeeSelect) — returns only what's needed
  listLite: (filter: FilterQuery<any>, limit = 20) =>
    User.find(filter)
      .select('_id name email role')
      .sort({ name: 1, email: 1 })
      .limit(Math.min(limit, 50))
      .lean(),

  // NEW: Lite single fetch for resolving a preselected value
  getLiteById: (id: string) =>
    User.findById(id)
      .select('_id name email role')
      .lean(),
};
