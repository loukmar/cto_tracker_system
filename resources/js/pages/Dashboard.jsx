import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import CTODashboard from './dashboards/CTODashboard';
import DepartmentDashboard from './dashboards/DepartmentDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === 'admin') {
        return <AdminDashboard />;
    } else if (user?.role === 'cto') {
        return <CTODashboard />;
    } else {
        return <DepartmentDashboard />;
    }
};

export default Dashboard;