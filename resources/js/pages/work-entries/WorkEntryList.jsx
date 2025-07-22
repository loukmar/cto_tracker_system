import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CalendarIcon,
    ClockIcon,
    TagIcon,
} from "@heroicons/react/24/outline";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const WorkEntryList = () => {
    const { user, canViewAllDepartments } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        date_to: new Date().toISOString().split("T")[0],
        department_id: "",
        work_type_id: "",
        status_id: "",
        search: "",
    });
    const [departments, setDepartments] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [pagination, setPagination] = useState({});
    const [deletingEntry, setDeletingEntry] = useState(null);

    // Add debug logging
    useEffect(() => {
        console.log("Current user:", user);
        console.log("User role:", user?.role);
        console.log("Is admin?", user?.role === "admin");
    }, [user]);

    useEffect(() => {
        fetchFilterData();
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [filters]);

    const fetchFilterData = async () => {
        try {
            const [deptRes, typeRes, statusRes] = await Promise.all([
                axios.get("/api/departments"),
                axios.get("/api/work-types"),
                axios.get("/api/statuses"),
            ]);

            setDepartments(deptRes.data);
            setWorkTypes(typeRes.data);
            setStatuses(statusRes.data);
        } catch (error) {
            console.error("Error fetching filter data:", error);
        }
    };

    const fetchEntries = async (page = 1) => {
        try {
            setLoading(true);
            console.log("Fetching entries with params:", { ...filters, page });

            const response = await axios.get("/api/work-entries", {
                params: { ...filters, page },
            });

            console.log("API Response:", response.data);

            // Handle both paginated and non-paginated responses
            if (response.data && response.data.data !== undefined) {
                setEntries(response.data.data);
                setPagination(response.data);
            } else if (Array.isArray(response.data)) {
                setEntries(response.data);
                setPagination({
                    last_page: 1,
                    current_page: 1,
                    from: 1,
                    to: response.data.length,
                    total: response.data.length,
                });
            }
        } catch (error) {
            console.error("Error fetching entries:", error);
            setEntries([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/work-entries/${deletingEntry.id}`);
            setDeletingEntry(null);
            fetchEntries();
        } catch (error) {
            console.error("Error deleting entry:", error);
            alert(error.response?.data?.message || "Error deleting entry");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Helper function to check if user can edit/delete entry
    const canEditEntry = (entry) => {
        if (!user) return false;
        // Admin can edit/delete any entry
        if (user.role === "admin") return true;
        // Users can edit/delete their own entries
        return user.id === entry.user_id;
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Work Entries
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all work entries in the system
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Link
                            to="/work-entries/create"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            New Entry
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-6 bg-white shadow rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                        <input
                            type="date"
                            value={filters.date_from}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    date_from: e.target.value,
                                })
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <input
                            type="date"
                            value={filters.date_to}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    date_to: e.target.value,
                                })
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {canViewAllDepartments && (
                            <select
                                value={filters.department_id}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        department_id: e.target.value,
                                    })
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <select
                            value={filters.work_type_id}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    work_type_id: e.target.value,
                                })
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">All Work Types</option>
                            {workTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={filters.search}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    search: e.target.value,
                                })
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <button
                            onClick={() =>
                                setFilters({
                                    date_from: new Date(
                                        Date.now() - 30 * 24 * 60 * 60 * 1000
                                    )
                                        .toISOString()
                                        .split("T")[0],
                                    date_to: new Date()
                                        .toISOString()
                                        .split("T")[0],
                                    department_id: "",
                                    work_type_id: "",
                                    status_id: "",
                                    search: "",
                                })
                            }
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Entries List */}
                <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hours
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-4 text-center"
                                    >
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : entries.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        No entries found
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                {formatDate(entry.work_date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div>
                                                <div className="font-medium">
                                                    {entry.title}
                                                </div>
                                                <div className="text-gray-500 truncate max-w-xs">
                                                    {entry.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {entry.department?.name || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {entry.work_type && (
                                                <span
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor:
                                                            entry.work_type
                                                                .color + "20",
                                                        color: entry.work_type
                                                            .color,
                                                    }}
                                                >
                                                    {entry.work_type.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                {entry.hours_spent}h
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {entry.status && (
                                                <span
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor:
                                                            entry.status.color +
                                                            "20",
                                                        color: entry.status
                                                            .color,
                                                    }}
                                                >
                                                    {entry.status.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/work-entries/${entry.id}`}
                                                    className="text-gray-600 hover:text-gray-900"
                                                    title="View"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </Link>
                                                {canEditEntry(entry) && (
                                                    <>
                                                        <Link
                                                            to={`/work-entries/${entry.id}/edit`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                setDeletingEntry(
                                                                    entry
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
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
                                        onClick={() => fetchEntries(index + 1)}
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

            {/* Delete Confirmation */}
            {deletingEntry && (
                <ConfirmDialog
                    title="Delete Work Entry"
                    message={`Are you sure you want to delete "${deletingEntry.title}"? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingEntry(null)}
                />
            )}
        </div>
    );
};

export default WorkEntryList;
