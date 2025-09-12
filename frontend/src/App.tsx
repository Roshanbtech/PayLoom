import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastHost } from './ui/toast';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

// import CreateSlip from './pages/admin/CreateSlip';
import ExpensesReview from './pages/admin/ExpensesReview';
import Employees from './pages/admin/Employees';
import MySlips from './pages/employee/MySlips';
// import SubmitExpense from './pages/employee/SubmitExpense';
import MyExpenses from './pages/employee/MyExpenses';
import Slips from './pages/admin/Slips';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastHost />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Slips />} />
            <Route path="slips" element={<Slips />} />
            <Route path="expenses" element={<ExpensesReview />} />
            <Route path="users" element={<Employees />} />
          </Route>

          <Route path="/app" element={
            <ProtectedRoute roles={['employee','admin']}>
              <EmployeeLayout />
            </ProtectedRoute>
          }>
            <Route index element={<MySlips />} />
            <Route path="slips" element={<MySlips />} />
            <Route path="expenses" element={<MyExpenses />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
