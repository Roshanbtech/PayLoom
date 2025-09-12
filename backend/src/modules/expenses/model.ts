import { Schema, model, Types } from 'mongoose';

const ExpenseSchema = new Schema({
  employeeId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  category: { type: String, enum: ['Travel','Internet','Meal','Other'], default: 'Other' },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String },
  status: { type: String, enum: ['submitted','approved','rejected'], default: 'submitted', index: true }
}, { timestamps: true });

export const Expense = model('Expense', ExpenseSchema);
