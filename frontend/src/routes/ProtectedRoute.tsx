import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../hooks/useAuth';


export function ProtectedRoute({ children, roles }: { children: React.ReactElement; roles?: Array<'admin'|'employee'> }) {
const { user, loading } = useAuth();
if (loading) return <div style={{ display:'grid', placeItems:'center', height:'60vh' }}><Spin /></div>;
if (!user) return <Navigate to="/login" replace />;
if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
return children;
}