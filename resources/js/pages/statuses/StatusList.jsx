import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import StatusModal from '../../components/statuses/StatusModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const StatusList = () => {
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStatus, setEditingStatus] = useState(null);
    const [deletingStatus, setDeletingStatus] = useState(null);

    useEffect(() => {
        fetchStatuses();
    }, []);

    const fetchStatuses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/statuses');
            setStatuses(response.data);
        } catch (error) {
            console.error('Error fetching statuses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            await axios.post('/api/statuses', data);
            setShowModal(false);
            fetchStatuses();
        } catch (error) {
            throw error;
        }
    };

    const handleUpdate = async (data) => {
        try {
            await axios.put(`/api/statuses/${editingStatus.id}`, data);
            setEditingStatus(null);
            fetchStatuses();
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/statuses/${deletingStatus.id}`);
            setDeletingStatus(null);
            fetchStatuses();
        } catch (error) {
            console.error('Error deleting status:', error);
            alert('Cannot delete status with existing entries');
        }
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Statuses</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage work entry statuses
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            New Status
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
                                                Color
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Order
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Type
                                            </th>
                                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : statuses.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                                    No statuses found
                                                </td>
                                            </tr>
                                        ) : (
                                            statuses.map((status) => (
                                                <tr key={status.id}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                        {status.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="h-6 w-6 rounded"
                                                                style={{ backgroundColor: status.color }}
                                                            />
                                                            <span className="ml-2">{status.color}</span>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {status.order}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                            status.is_final 
                                                                ? 'bg-purple-100 text-purple-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {status.is_final ? 'Final' : 'In Progress'}
                                                        </span>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <button
                                                            onClick={() => setEditingStatus(status)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingStatus(status)}
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
            {(showModal || editingStatus) && (
                <StatusModal
                    status={editingStatus}
                    onClose={() => {
                        setShowModal(false);
                        setEditingStatus(null);
                    }}
                    onSubmit={editingStatus ? handleUpdate : handleCreate}
                />
            )}

            {deletingStatus && (
                <ConfirmDialog
                    title="Delete Status"
                    message={`Are you sure you want to delete ${deletingStatus.name}? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingStatus(null)}
                />
            )}
        </div>
    );
};

export default StatusList;
