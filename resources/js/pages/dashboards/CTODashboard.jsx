import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    ChartBarIcon, 
    ClockIcon, 
    CalendarDaysIcon,
    UsersIcon,
    DocumentTextIcon,
    ArrowTrendingUpIcon // Changed from TrendingUpIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CTODashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalHours: 0,
        totalEntries: 0,
        activeDepartments: 0,
        completedTasks: 0
    });
    const [recentEntries, setRecentEntries] = useState([]);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [workTypeStats, setWorkTypeStats] = useState([]);
    const [trendData, setTrendData] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Temporarily comment out API calls to test UI
            /*
            const [statsRes, entriesRes, summaryRes] = await Promise.all([
                axios.get('/api/dashboard/stats'),
                axios.get('/api/work-entries', { params: { limit: 10 } }),
                axios.get('/api/work-entries/summary', {
                    params: {
                        date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        date_to: new Date().toISOString().split('T')[0]
                    }
                })
            ]);

            setStats(statsRes.data);
            setRecentEntries(entriesRes.data.data);
            setDepartmentStats(summaryRes.data.by_department);
            setWorkTypeStats(summaryRes.data.by_work_type);
            */
            
            // Use dummy data for now
            setStats({
                totalHours: 120,
                totalEntries: 45,
                activeDepartments: 4,
                completedTasks: 32
            });
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">CTO Dashboard</h1>
                
                {/* Stats Grid */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ClockIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Hours (30d)
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.totalHours}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Entries (30d)
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.totalEntries}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UsersIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Active Departments
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.activeDepartments}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ArrowTrendingUpIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Completed Tasks
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.completedTasks}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coming soon message for charts */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Charts Coming Soon</h3>
                    <p className="text-gray-600">Dashboard charts will be displayed here once data is available.</p>
                </div>
            </div>
        </div>
    );
};

export default CTODashboard;