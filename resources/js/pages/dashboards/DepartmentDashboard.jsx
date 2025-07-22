import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { 
    ClockIcon,
    DocumentTextIcon,
    CalendarIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

const DepartmentDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayHours: 0,
        weekHours: 0,
        monthEntries: 0,
        pendingTasks: 0
    });
    const [recentEntries, setRecentEntries] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, entriesRes] = await Promise.all([
                axios.get('/api/dashboard/stats'),
                axios.get('/api/work-entries', { params: { limit: 5 } })
            ]);

            setStats(statsRes.data);
            setRecentEntries(entriesRes.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

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
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Welcome back, {user?.name}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {user?.department?.name} Department
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Link
                            to="/work-entries/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            New Entry
                        </Link>
                    </div>
                </div>

                {/* Stats */}
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
                                            Today's Hours
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.todayHours}
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
                                    <CalendarIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            This Week
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.weekHours} hours
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
                                            Month Entries
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.monthEntries}
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
                                            Pending Tasks
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.pendingTasks}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Entries */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900">Recent Activities</h2>
                    <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                        {recentEntries.length === 0 ? (
                            <div className="text-center py-12">
                                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No entries</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new work entry.</p>
                                <div className="mt-6">
                                    <Link
                                        to="/work-entries/create"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                        New Entry
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {recentEntries.map((entry) => (
                                    <li key={entry.id}>
                                        <Link to={`/work-entries/${entry.id}`} className="block hover:bg-gray-50 px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-blue-600 truncate">
                                                    {entry.title}
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                                       style={{ backgroundColor: entry.status.color + '20', color: entry.status.color }}>
                                                        {entry.status.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                        {new Date(entry.work_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                    {entry.hours_spent} hours
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {recentEntries.length > 0 && (
                        <div className="mt-4 text-center">
                            <Link to="/work-entries" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                View all entries
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentDashboard;