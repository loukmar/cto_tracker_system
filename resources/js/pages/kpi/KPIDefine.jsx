import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import KPIDefinitionModal from '../../components/kpi/KPIDefinitionModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const KPIDefine = () => {
    const [kpiDefinitions, setKpiDefinitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingKPI, setEditingKPI] = useState(null);
    const [deletingKPI, setDeletingKPI] = useState(null);

    // Mock data for demonstration
    const mockKPIs = [
        { id: 1, name: 'Tasks Completed', key: 'tasks_completed', unit: 'count', target: 10, description: 'Number of tasks completed' },
        { id: 2, name: 'Response Time', key: 'response_time', unit: 'hours', target: 24, description: 'Average response time' },
        { id: 3, name: 'Quality Score', key: 'quality_score', unit: 'percentage', target: 90, description: 'Quality assessment score' },
        { id: 4, name: 'Customer Satisfaction', key: 'customer_satisfaction', unit: 'rating', target: 4.5, description: 'Customer satisfaction rating' },
    ];

    useEffect(() => {
        fetchKPIDefinitions();
    }, []);

    const fetchKPIDefinitions = async () => {
        try {
            setLoading(true);
            // For now, use mock data
            setTimeout(() => {
                setKpiDefinitions(mockKPIs);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching KPI definitions:', error);
            setLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            // Mock create
            const newKPI = { ...data, id: Date.now() };
            setKpiDefinitions([...kpiDefinitions, newKPI]);
            setShowModal(false);
        } catch (error) {
            throw error;
        }
    };

    const handleUpdate = async (data) => {
        try {
            // Mock update
            setKpiDefinitions(kpiDefinitions.map(kpi => 
                kpi.id === editingKPI.id ? { ...kpi, ...data } : kpi
            ));
            setEditingKPI(null);
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            // Mock delete
            setKpiDefinitions(kpiDefinitions.filter(kpi => kpi.id !== deletingKPI.id));
            setDeletingKPI(null);
        } catch (error) {
            console.error('Error deleting KPI:', error);
        }
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Define KPIs</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Set up key performance indicators for tracking
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            New KPI
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Name
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Key
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Unit
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Target
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Description
                                            </th>
                                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : kpiDefinitions.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                                    No KPIs defined yet
                                                </td>
                                            </tr>
                                        ) : (
                                            kpiDefinitions.map((kpi) => (
                                                <tr key={kpi.id}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                        {kpi.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                            {kpi.key}
                                                        </code>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {kpi.unit}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {kpi.target}
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-500">
                                                        {kpi.description}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <button
                                                            onClick={() => setEditingKPI(kpi)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingKPI(kpi)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {(showModal || editingKPI) && (
                <KPIDefinitionModal
                    kpi={editingKPI}
                    onClose={() => {
                        setShowModal(false);
                        setEditingKPI(null);
                    }}
                    onSubmit={editingKPI ? handleUpdate : handleCreate}
                />
            )}

            {deletingKPI && (
                <ConfirmDialog
                    title="Delete KPI"
                    message={`Are you sure you want to delete ${deletingKPI.name}? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingKPI(null)}
                />
            )}
        </div>
    );
};

export default KPIDefine;
