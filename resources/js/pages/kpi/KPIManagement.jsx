import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    ChartBarIcon, 
    PlusIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline';

const KPIManagement = () => {
    const [kpiMetrics, setKpiMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchKPIData();
    }, [dateRange]);

    const fetchKPIData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/reports/kpi', {
                params: {
                    date_from: dateRange.from,
                    date_to: dateRange.to,
                }
            });
            setKpiMetrics(Object.entries(response.data.kpi_metrics || {}));
        } catch (error) {
            console.error('Error fetching KPI data:', error);
        } finally {
            setLoading(false);
        }
    };

    const kpiCards = [
        {
            title: 'Define KPIs',
            description: 'Set up key performance indicators for tracking',
            icon: ChartBarIcon,
            href: '/kpi/define',
            color: 'bg-blue-500'
        },
        {
            title: 'Track Performance',
            description: 'Monitor and record KPI metrics',
            icon: ArrowTrendingUpIcon,
            href: '/kpi/track',
            color: 'bg-green-500'
        },
        {
            title: 'KPI Reports',
            description: 'View detailed KPI analysis and trends',
            icon: ArrowTrendingDownIcon,
            href: '/reports/kpi',
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">KPI Management</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage and track key performance indicators
                        </p>
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="mt-6 bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date Range</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">From Date</label>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">To Date</label>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* KPI Action Cards */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {kpiCards.map((card) => (
                        <Link
                            key={card.title}
                            to={card.href}
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                                        <card.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {card.title}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {card.description}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Current KPI Summary */}
                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Current KPI Summary</h3>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {loading ? (
                            <div className="px-4 py-5 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                        ) : kpiMetrics.length === 0 ? (
                            <div className="px-4 py-5 text-center text-gray-500">
                                No KPI data available for the selected period
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {kpiMetrics.map(([metric, data]) => (
                                    <div key={metric} className="px-4 py-5 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    {metric.replace(/_/g, ' ').toUpperCase()}
                                                </h4>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Tracked from {data.count} entries
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4 text-center">
                                                <div>
                                                    <p className="text-sm text-gray-500">Average</p>
                                                    <p className="text-lg font-semibold">{data.average}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Min</p>
                                                    <p className="text-lg font-semibold">{data.min}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Max</p>
                                                    <p className="text-lg font-semibold">{data.max}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Total</p>
                                                    <p className="text-lg font-semibold">{data.total}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPIManagement;