import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    DocumentArrowDownIcon,
    ChartBarIcon,
    CalendarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });

    const reportTypes = [
        {
            title: 'Monthly Report',
            description: 'Detailed monthly activity report with summaries',
            icon: CalendarIcon,
            href: '/reports/monthly',
            color: 'bg-blue-500'
        },
        {
            title: 'KPI Report',
            description: 'Key Performance Indicators analysis',
            icon: ChartBarIcon,
            href: '/reports/kpi',
            color: 'bg-green-500'
        },
        {
            title: 'Department Summary',
            description: 'Department-wise work summary and statistics',
            icon: DocumentTextIcon,
            href: '/reports/department',
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Generate and download various reports for analysis
                        </p>
                    </div>
                </div>

                {/* Date Range Selector */}
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

                {/* Report Types Grid */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {reportTypes.map((report) => (
                        <div key={report.title} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${report.color}`}>
                                        <report.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {report.title}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {report.description}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <Link
                                        to={`${report.href}?from=${dateRange.from}&to=${dateRange.to}`}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Generate Report
                                        <DocumentArrowDownIcon className="ml-2 -mr-0.5 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Export */}
                <div className="mt-8 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Export</h3>
                    <div className="flex gap-4">
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                            Export to Excel
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                            Export to PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;    