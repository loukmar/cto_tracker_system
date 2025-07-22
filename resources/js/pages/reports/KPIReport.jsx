import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const KPIReport = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [dateRange, setDateRange] = useState({
        from: searchParams.get('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: searchParams.get('to') || new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchReport();
    }, [dateRange]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/reports/kpi', {
                params: {
                    date_from: dateRange.from,
                    date_to: dateRange.to,
                }
            });
            setReport(response.data);
        } catch (error) {
            console.error('Error fetching KPI report:', error);
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
                        <h1 className="text-2xl font-semibold text-gray-900">KPI Report</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Key Performance Indicators from {dateRange.from} to {dateRange.to}
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex gap-2">
                        <input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(report?.kpi_metrics || {}).map(([metric, data]) => (
                        <div key={metric} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex-shrink-0">
                                        <ChartBarIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                    {data.average > data.min && (
                                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                                <p className="mt-2 text-sm font-medium text-gray-500 truncate">
                                    {metric.replace(/_/g, ' ').toUpperCase()}
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {data.average}
                                </p>
                                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        <p className="text-gray-500">Min</p>
                                        <p className="font-medium">{data.min}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Max</p>
                                        <p className="font-medium">{data.max}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Total</p>
                                        <p className="font-medium">{data.total}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Report Summary</h3>
                    <p className="text-gray-600">
                        Total entries with KPI data: <span className="font-semibold">{report?.entries_with_kpi || 0}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default KPIReport;