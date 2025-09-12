export type Role = 'admin' | 'employee';
export type User = { id: string; email: string; role: Role; name?: string };

export type Allowance = { name: string; amount: number };
export type DeductionItem = { name: string; amount: number };

export type SalarySlip = {
  _id: string;
  employeeId: string;
  month: string;
  earnings: { basic: number; hra?: number; allowances?: Allowance[] };
  deductions?: { tax?: number; other?: DeductionItem[] };
  notes?: string;
  createdAt: string;
};

export type Category = 'Travel' | 'Internet' | 'Meal' | 'Other';

export type Expense = {
  _id: string;
  employeeId: string;
  date: string; 
  category: Category;
  amount: number;
  description?: string;
  status: 'submitted'|'approved'|'rejected';
  createdAt: string;
};

export type ExpenseAdminRow = Omit<Expense, 'employeeId'> & {
  employeeId: { _id: string; name?: string; email: string } | string;
};
