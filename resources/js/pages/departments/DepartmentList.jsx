import React, { useState, useEffect } from 'react';
import { departmentAPI } from '../../utils/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DepartmentModal from '../../components/departments/DepartmentModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../contexts/AuthContext';


const DepartmentList = () => {
    const { user, isAdmin } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [deletingDepartment, setDeletingDepartment] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await departmentAPI.getAll();
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setError('Failed to load departments. ' + (error.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            await departmentAPI.create(data);
            setShowModal(false);
            fetchDepartments();
        } catch (error) {
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to create departments');
            }
            throw error;
        }
    };

    const handleUpdate = async (data) => {
        try {
            await departmentAPI.update(editingDepartment.id, data);
            setEditingDepartment(null);
            fetchDepartments();
        } catch (error) {
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to update departments');
            }
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            await departmentAPI.delete(deletingDepartment.id);
            setDeletingDepartment(null);
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
            if (error.response?.status === 403) {
                alert('You do not have permission to delete departments');
            } else if (error.response?.status === 422) {
                alert(error.response.data.message || 'Cannot delete department with existing users or entries');
            } else {
                alert('Failed to delete department');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage organization departments
                        </p>
                    </div>
                    {isAdmin && (
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                New Department
                            </button>
                        </div>
                    )}
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
                                                Code
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Description
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Color
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Status
                                            </th>
                                            {isAdmin && (
                                                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Actions</span>
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {departments.length === 0 ? (
                                            <tr>
                                                <td colSpan={isAdmin ? "6" : "5"} className="text-center py-4 text-gray-500">
                                                    No departments found
                                                </td>
                                            </tr>
                                        ) : (
                                            departments.map((department) => (
                                                <tr key={department.id}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                        {department.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {department.code}
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-500">
                                                        {department.description || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="h-6 w-6 rounded"
                                                                style={{ backgroundColor: department.color }}
                                                            />
                                                            <span className="ml-2">{department.color}</span>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                            department.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {department.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <button
                                                                onClick={() => setEditingDepartment(department)}
                                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                                title="Edit"
                                                            >
                                                                <PencilIcon className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingDepartment(department)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Delete"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        </td>
                                                    )}
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
            {showModal && (
                <DepartmentModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreate}
                />
            )}

            {editingDepartment && (
                <DepartmentModal
                    department={editingDepartment}
                    onClose={() => setEditingDepartment(null)}
                    onSubmit={handleUpdate}
                />
            )}

            {deletingDepartment && (
                <ConfirmDialog
                    title="Delete Department"
                    message={`Are you sure you want to delete ${deletingDepartment.name}? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingDepartment(null)}
                />
            )}
        </div>
    );
};

export default DepartmentList;