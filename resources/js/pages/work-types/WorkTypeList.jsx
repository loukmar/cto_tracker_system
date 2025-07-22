import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import WorkTypeModal from '../../components/work-types/WorkTypeModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const WorkTypeList = () => {
    const [workTypes, setWorkTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWorkType, setEditingWorkType] = useState(null);
    const [deletingWorkType, setDeletingWorkType] = useState(null);

    useEffect(() => {
        fetchWorkTypes();
    }, []);

    const fetchWorkTypes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/work-types');
            setWorkTypes(response.data);
        } catch (error) {
            console.error('Error fetching work types:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            await axios.post('/api/work-types', data);
            setShowModal(false);
            fetchWorkTypes();
        } catch (error) {
            throw error;
        }
    };

    const handleUpdate = async (data) => {
        try {
            await axios.put(`/api/work-types/${editingWorkType.id}`, data);
            setEditingWorkType(null);
            fetchWorkTypes();
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/work-types/${deletingWorkType.id}`);
            setDeletingWorkType(null);
            fetchWorkTypes();
        } catch (error) {
            console.error('Error deleting work type:', error);
            alert('Cannot delete work type with existing entries');
        }
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Work Types</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage different types of work activities
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            New Work Type
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
                                                Icon
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Color
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Order
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Status
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
                                        ) : workTypes.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                                    No work types found
                                                </td>
                                            </tr>
                                        ) : (
                                            workTypes.map((workType) => (
                                                <tr key={workType.id}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                        {workType.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {workType.icon || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="h-6 w-6 rounded"
                                                                style={{ backgroundColor: workType.color }}
                                                            />
                                                            <span className="ml-2">{workType.color}</span>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {workType.order}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                            workType.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {workType.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <button
                                                            onClick={() => setEditingWorkType(workType)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingWorkType(workType)}
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
            {(showModal || editingWorkType) && (
                <WorkTypeModal
                    workType={editingWorkType}
                    onClose={() => {
                        setShowModal(false);
                        setEditingWorkType(null);
                    }}
                    onSubmit={editingWorkType ? handleUpdate : handleCreate}
                />
            )}

            {deletingWorkType && (
                <ConfirmDialog
                    title="Delete Work Type"
                    message={`Are you sure you want to delete ${deletingWorkType.name}? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingWorkType(null)}
                />
            )}
        </div>
    );
};

export default WorkTypeList;