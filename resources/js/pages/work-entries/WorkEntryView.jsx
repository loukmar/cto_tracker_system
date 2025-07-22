import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    CalendarIcon,
    ClockIcon,
    UserIcon,
    PaperClipIcon,
    TagIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const WorkEntryView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        fetchEntry();
    }, [id]);

    const fetchEntry = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/work-entries/${id}`);
            setEntry(response.data);
        } catch (error) {
            console.error("Error fetching entry:", error);
            navigate("/work-entries");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/work-entries/${id}`);
            navigate("/work-entries");
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!entry) {
        return null;
    }

    const canEdit = user?.id === entry.user_id || user?.isAdmin;

    return (
        <div className="py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to="/work-entries"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to entries
                    </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {entry.title}
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Work entry details and information
                                </p>
                            </div>
                            {canEdit && (
                                <div className="flex gap-2">
                                    <Link
                                        to={`/work-entries/${id}/edit`}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <PencilIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() =>
                                            setShowDeleteDialog(true)
                                        }
                                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-200">
                        <dl>
                            {/* Status */}
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Status
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        style={{
                                            backgroundColor:
                                                entry.status.color + "20",
                                            color: entry.status.color,
                                        }}
                                    >
                                        {entry.status.name}
                                    </span>
                                </dd>
                            </div>

                            {/* Work Date */}
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                                    Work Date
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {new Date(
                                        entry.work_date
                                    ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </dd>
                            </div>

                            {/* Hours Spent */}
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <ClockIcon className="mr-2 h-5 w-5 text-gray-400" />
                                    Hours Spent
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {entry.hours_spent} hours
                                </dd>
                            </div>

                            {/* User */}
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                                    Created By
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {entry.user.name} ({entry.department.name})
                                </dd>
                            </div>

                            {/* Work Type */}
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Work Type
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        style={{
                                            backgroundColor:
                                                entry.work_type.color + "20",
                                            color: entry.work_type.color,
                                        }}
                                    >
                                        {entry.work_type.name}
                                    </span>
                                </dd>
                            </div>

                            {/* Location */}
                            {entry.location && (
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <MapPinIcon className="mr-2 h-5 w-5 text-gray-400" />
                                        Location
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {entry.location}
                                    </dd>
                                </div>
                            )}

                            {/* Tags */}
                            {entry.tags && entry.tags.length > 0 && (
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <TagIcon className="mr-2 h-5 w-5 text-gray-400" />
                                        Tags
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="flex flex-wrap gap-2">
                                            {entry.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </dd>
                                </div>
                            )}

                            {/* Description */}
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Description
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                                    {entry.description}
                                </dd>
                            </div>

                            {/* Attachments */}
                            {entry.attachments &&
                                entry.attachments.length > 0 && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                                            <PaperClipIcon className="mr-2 h-5 w-5 text-gray-400" />
                                            Attachments
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                                {entry.attachments.map(
                                                    (attachment) => (
                                                        <li
                                                            key={attachment.id}
                                                            className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                                        >
                                                            <div className="w-0 flex-1 flex items-center">
                                                                <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                                                <span className="ml-2 flex-1 w-0 truncate">
                                                                    {
                                                                        attachment.file_name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="ml-4 flex-shrink-0">
                                                                <a
                                                                    href={`/storage/${attachment.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="font-medium text-blue-600 hover:text-blue-500"
                                                                >
                                                                    Download
                                                                </a>
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </dd>
                                    </div>
                                )}

                            {/* Created At */}
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Created
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {new Date(
                                        entry.created_at
                                    ).toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteDialog && (
                    <ConfirmDialog
                        title="Delete Work Entry"
                        message="Are you sure you want to delete this work entry? This action cannot be undone."
                        onConfirm={handleDelete}
                        onCancel={() => setShowDeleteDialog(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default WorkEntryView;
