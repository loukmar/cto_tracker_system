import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";
import UserCreateModal from "../../components/users/UserCreateModal";
import UserEditModal from "../../components/users/UserEditModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const UserList = () => {
    const { user: currentUser, isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        role: "",
        department_id: "",
        is_active: "",
    });
    const [pagination, setPagination] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page,
            };
            const response = await axios.get("/api/users", { params });
            setUsers(response.data.data);
            setPagination(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (userData) => {
        try {
            await axios.post("/api/users", userData);
            setShowCreateModal(false);
            fetchUsers();
        } catch (error) {
            throw error;
        }
    };

    const handleUpdateUser = async (userData) => {
        try {
            await axios.put(`/api/users/${editingUser.id}`, userData);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`/api/users/${deletingUser.id}`);
            setDeletingUser(null);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const roleColors = {
        admin: "bg-red-100 text-red-800",
        cto: "bg-purple-100 text-purple-800",
        department_owner: "bg-blue-100 text-blue-800",
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Users
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage system users and their roles
                        </p>
                    </div>
                    {isAdmin && (
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                            >
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                New User
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        search: e.target.value,
                                    })
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <select
                                value={filters.role}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        role: e.target.value,
                                    })
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="cto">CTO</option>
                                <option value="department_owner">
                                    Department Owner
                                </option>
                            </select>
                            <select
                                value={filters.is_active}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        is_active: e.target.value,
                                    })
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">All Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            <button
                                onClick={() =>
                                    setFilters({
                                        search: "",
                                        role: "",
                                        department_id: "",
                                        is_active: "",
                                    })
                                }
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
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
                                                Department
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Role
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Status
                                            </th>
                                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {loading ? (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="text-center py-4"
                                                >
                                                    <div className="inline-flex items-center">
                                                        <svg
                                                            className="animate-spin h-5 w-5 mr-3 text-gray-600"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                                fill="none"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                        Loading...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : users.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="text-center py-4 text-gray-500"
                                                >
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                {user.avatar ? (
                                                                    <img
                                                                        className="h-10 w-10 rounded-full"
                                                                        src={
                                                                            user.avatar
                                                                        }
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                        <span className="text-sm font-medium text-gray-600">
                                                                            {user.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {user.department?.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <span
                                                            className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                                roleColors[
                                                                    user.role
                                                                ]
                                                            }`}
                                                        >
                                                            {user.role
                                                                .replace(
                                                                    "_",
                                                                    " "
                                                                )
                                                                .toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <span
                                                            className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                                user.is_active
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {user.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        {(isAdmin ||
                                                            currentUser.id ===
                                                                user.id) && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        setEditingUser(
                                                                            user
                                                                        )
                                                                    }
                                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                                >
                                                                    <PencilIcon className="h-5 w-5" />
                                                                </button>
                                                                {isAdmin &&
                                                                    currentUser.id !==
                                                                        user.id && (
                                                                        <button
                                                                            onClick={() =>
                                                                                setDeletingUser(
                                                                                    user
                                                                                )
                                                                            }
                                                                            className="text-red-600 hover:text-red-900"
                                                                        >
                                                                            <TrashIcon className="h-5 w-5" />
                                                                        </button>
                                                                    )}
                                                            </>
                                                        )}
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

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {pagination.from} to {pagination.to} of{" "}
                            {pagination.total} results
                        </div>
                        <div className="flex gap-2">
                            {[...Array(pagination.last_page)].map(
                                (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => fetchUsers(index + 1)}
                                        className={`px-3 py-1 text-sm rounded ${
                                            pagination.current_page ===
                                            index + 1
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <UserCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateUser}
                />
            )}

            {editingUser && (
                <UserEditModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSubmit={handleUpdateUser}
                />
            )}

            {deletingUser && (
                <ConfirmDialog
                    title="Delete User"
                    message={`Are you sure you want to delete ${deletingUser.name}? This action cannot be undone.`}
                    onConfirm={handleDeleteUser}
                    onCancel={() => setDeletingUser(null)}
                />
            )}
        </div>
    );
};

export default UserList;
