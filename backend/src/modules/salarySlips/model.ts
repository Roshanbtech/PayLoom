import { Schema, model, Types } from 'mongoose';

const Line = new Schema({ name: { type: String, required: true }, amount: { type: Number, required: true, min: 0 } }, { _id: false });

const SalarySlipSchema = new Schema({
  employeeId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  month: { type: String, required: true, match: /^\d{4}-\d{2}$/, index: true }, // YYYY-MM
  earnings: {
    basic: { type: Number, required: true, min: 0 },
    hra: { type: Number, default: 0, min: 0 },
    allowances: { type: [Line], default: [] }
  },
  deductions: {
    tax: { type: Number, default: 0, min: 0 },
    other: { type: [Line], default: [] }
  },
  netPay: { type: Number, required: true, min: 0 },
  notes: { type: String },
  createdBy: { type: Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export type SalarySlipDoc = any;
export const SalarySlip = model<SalarySlipDoc>('SalarySlip', SalarySlipSchema);
