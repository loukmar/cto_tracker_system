import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import "./bootstrap";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";

// User Management
import UserList from "./pages/users/UserList";
import UserProfile from "./pages/users/UserProfile";

// Work Entry Management
import WorkEntryList from "./pages/work-entries/WorkEntryList";
import WorkEntryCreate from "./pages/work-entries/WorkEntryCreate";
import WorkEntryEdit from "./pages/work-entries/WorkEntryEdit";
import WorkEntryView from "./pages/work-entries/WorkEntryView";

// Department Management
import DepartmentList from "./pages/departments/DepartmentList";

// Work Type Management
import WorkTypeList from "./pages/work-types/WorkTypeList";

// Status Management
import StatusList from "./pages/statuses/StatusList";

// KPI Management
import KPIManagement from "./pages/kpi/KPIManagement";
import KPIDefine from "./pages/kpi/KPIDefine";

// Reports
import Reports from "./pages/reports/Reports";
import MonthlyReport from "./pages/reports/MonthlyReport";
import KPIReport from "./pages/reports/KPIReport";

// Settings
import Settings from "./pages/settings/Settings";
import Categories from "./pages/settings/Categories";
import SiteSettings from "./pages/settings/SiteSettings";

const App = () => {
    const { loading, isAuthenticated, user } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={
                    !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
                }
            />
            <Route
                path="/register"
                element={
                    !isAuthenticated ? (
                        <Register />
                    ) : (
                        <Navigate to="/dashboard" />
                    )
                }
            />
            <Route
                path="/forgot-password"
                element={
                    !isAuthenticated ? (
                        <ForgotPassword />
                    ) : (
                        <Navigate to="/dashboard" />
                    )
                }
            />
            <Route
                path="/reset-password"
                element={
                    !isAuthenticated ? (
                        <ResetPassword />
                    ) : (
                        <Navigate to="/dashboard" />
                    )
                }
            />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* User Management */}
                    <Route path="/users" element={<UserList />} />
                    <Route path="/profile" element={<UserProfile />} />

                    {/* Work Entries */}
                    <Route path="/work-entries" element={<WorkEntryList />} />
                    <Route
                        path="/work-entries/create"
                        element={<WorkEntryCreate />}
                    />
                    <Route
                        path="/work-entries/:id/edit"
                        element={<WorkEntryEdit />}
                    />
                    <Route
                        path="/work-entries/:id"
                        element={<WorkEntryView />}
                    />

                    {/* Departments */}
                    <Route path="/departments" element={<DepartmentList />} />

                    {/* Work Types */}
                    <Route path="/work-types" element={<WorkTypeList />} />

                    {/* Statuses */}
                    <Route path="/statuses" element={<StatusList />} />

                    {/* KPI */}
                    <Route path="/kpi" element={<KPIManagement />} />
                    <Route path="/kpi/define" element={<KPIDefine />} />

                    {/* Reports */}
                    <Route path="/reports" element={<Reports />} />
                    <Route
                        path="/reports/monthly"
                        element={<MonthlyReport />}
                    />
                    <Route path="/reports/kpi" element={<KPIReport />} />

                    {/* Settings */}
                    <Route path="/settings" element={<Settings />} />
                    <Route
                        path="/settings/categories"
                        element={<Categories />}
                    />
                    <Route path="/settings/site" element={<SiteSettings />} />
                </Route>
            </Route>

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};

export default App;
// Mount the app
const container = document.getElementById("app");
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
}
