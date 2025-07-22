import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { XMarkIcon, PaperClipIcon } from "@heroicons/react/24/outline";

const schema = yup.object({
    work_date: yup
        .date()
        .required("Work date is required")
        .max(new Date(), "Work date cannot be in the future"),
    title: yup.string().required("Title is required").max(255),
    description: yup.string().required("Description is required"),
    department_id: yup.number().required("Department is required"),
    work_type_id: yup.number().required("Work type is required"),
    status_id: yup.number().required("Status is required"),
    hours_spent: yup
        .number()
        .required("Hours spent is required")
        .min(0)
        .max(24),
    location: yup.string().nullable(),
    tags: yup.array().of(yup.string()),
});

const WorkEntryEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, canViewAllDepartments } = useAuth();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [newAttachments, setNewAttachments] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const tags = watch("tags") || [];

    useEffect(() => {
        fetchFormData();
        fetchEntry();
    }, [id]);

    const fetchFormData = async () => {
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
            console.error("Error fetching form data:", error);
        }
    };

    const fetchEntry = async () => {
        try {
            const response = await axios.get(`/api/work-entries/${id}`);
            const entry = response.data;

            // Format the date properly for the date input
            let formattedDate = entry.work_date;
            if (formattedDate && !formattedDate.includes("T")) {
                // Already in YYYY-MM-DD format
                formattedDate = entry.work_date;
            } else if (formattedDate) {
                // Convert from datetime to date only
                formattedDate = entry.work_date.split("T")[0];
            }

            reset({
                work_date: formattedDate,
                title: entry.title,
                description: entry.description,
                department_id: entry.department_id,
                work_type_id: entry.work_type_id,
                status_id: entry.status_id,
                hours_spent: entry.hours_spent,
                location: entry.location || "",
                tags: entry.tags || [],
            });

            // Set existing attachments
            setExistingAttachments(entry.attachments || []);
        } catch (error) {
            console.error("Error fetching entry:", error);
            navigate("/work-entries");
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewAttachments([...newAttachments, ...files]);
    };

    const removeNewAttachment = (index) => {
        setNewAttachments(newAttachments.filter((_, i) => i !== index));
    };

    const removeExistingAttachment = async (attachmentId) => {
        try {
            await axios.delete(
                `/api/work-entries/${id}/attachments/${attachmentId}`
            );
            setExistingAttachments(
                existingAttachments.filter((att) => att.id !== attachmentId)
            );
        } catch (error) {
            console.error("Error removing attachment:", error);
            alert("Error removing attachment");
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setValue("tags", [...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setValue(
            "tags",
            tags.filter((tag) => tag !== tagToRemove)
        );
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Format the date properly
            let formattedDate = "";
            if (data.work_date) {
                // If it's a Date object, format it
                if (data.work_date instanceof Date) {
                    const year = data.work_date.getFullYear();
                    const month = String(
                        data.work_date.getMonth() + 1
                    ).padStart(2, "0");
                    const day = String(data.work_date.getDate()).padStart(
                        2,
                        "0"
                    );
                    formattedDate = `${year}-${month}-${day}`;
                }
                // If it's already in YYYY-MM-DD format, use it
                else if (/^\d{4}-\d{2}-\d{2}$/.test(data.work_date)) {
                    formattedDate = data.work_date;
                }
                // Otherwise, try to parse it
                else {
                    const dateObj = new Date(data.work_date);
                    if (!isNaN(dateObj)) {
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(
                            2,
                            "0"
                        );
                        const day = String(dateObj.getDate()).padStart(2, "0");
                        formattedDate = `${year}-${month}-${day}`;
                    }
                }
            }

            // Prepare the data with proper formatting
            const formattedData = {
                work_date: formattedDate,
                title: data.title,
                description: data.description,
                hours_spent: parseInt(data.hours_spent),
                department_id: parseInt(data.department_id),
                work_type_id: parseInt(data.work_type_id),
                status_id: parseInt(data.status_id),
                location: data.location || "",
                tags: Array.isArray(data.tags) ? data.tags : [],
                kpi_metrics: data.kpi_metrics || null,
            };

            console.log("Sending update data:", formattedData);

            const response = await axios.put(
                `/api/work-entries/${id}`,
                formattedData
            );
            console.log("Update successful:", response.data);

            // Handle new file uploads if any
            if (newAttachments.length > 0) {
                const formData = new FormData();
                newAttachments.forEach((file, index) => {
                    formData.append(`attachments[${index}]`, file);
                });

                try {
                    await axios.post(
                        `/api/work-entries/${id}/attachments`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                } catch (uploadError) {
                    console.error("Error uploading attachments:", uploadError);
                }
            }

            navigate(`/work-entries/${id}`);
        } catch (error) {
            console.error("Error updating work entry:", error);

            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};
                console.log("Validation errors:", validationErrors);

                let errorMessage = "Validation errors:\n\n";
                Object.keys(validationErrors).forEach((field) => {
                    errorMessage += `${field}: ${validationErrors[field].join(
                        ", "
                    )}\n`;
                });

                alert(errorMessage);
            } else {
                alert("Error updating work entry. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Edit Work Entry
                        </h2>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-8 space-y-6"
                >
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            {/* Work Date */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Work Date
                                </label>
                                <input
                                    type="date"
                                    {...register("work_date")}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                {errors.work_date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.work_date.message}
                                    </p>
                                )}
                            </div>

                            {/* Hours Spent */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Hours Spent
                                </label>
                                <input
                                    type="number"
                                    {...register("hours_spent")}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                {errors.hours_spent && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.hours_spent.message}
                                    </p>
                                )}
                            </div>

                            {/* Title */}
                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    {...register("title")}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Department */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Department
                                </label>
                                <select
                                    {...register("department_id")}
                                    disabled={!canViewAllDepartments}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.department_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.department_id.message}
                                    </p>
                                )}
                            </div>

                            {/* Work Type */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Work Type
                                </label>
                                <select
                                    {...register("work_type_id")}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Work Type</option>
                                    {workTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.work_type_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.work_type_id.message}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    {...register("status_id")}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Status</option>
                                    {statuses.map((status) => (
                                        <option
                                            key={status.id}
                                            value={status.id}
                                        >
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.status_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.status_id.message}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Location (Optional)
                                </label>
                                <input
                                    type="text"
                                    {...register("location")}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Tags */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tags
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) =>
                                            setTagInput(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            e.key === "Enter" &&
                                            (e.preventDefault(), addTag())
                                        }
                                        className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
                                        placeholder="Add a tag"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:text-blue-600"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    {...register("description")}
                                    rows={4}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Existing Attachments */}
                            {existingAttachments.length > 0 && (
                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Current Attachments
                                    </label>
                                    <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                                        {existingAttachments.map(
                                            (attachment) => (
                                                <li
                                                    key={attachment.id}
                                                    className="py-3 px-4 flex justify-between items-center"
                                                >
                                                    <div className="flex items-center">
                                                        <PaperClipIcon className="h-5 w-5 text-gray-400" />
                                                        <span className="ml-2 text-sm text-gray-900">
                                                            {
                                                                attachment.file_name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={`/storage/${attachment.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:text-blue-500"
                                                        >
                                                            Download
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeExistingAttachment(
                                                                    attachment.id
                                                                )
                                                            }
                                                            className="text-sm text-red-600 hover:text-red-500"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* New Attachments */}
                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Add New Attachments
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload files</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">
                                                or drag and drop
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, PDF up to 10MB
                                        </p>
                                    </div>
                                </div>

                                {newAttachments.length > 0 && (
                                    <ul className="mt-3 divide-y divide-gray-200">
                                        {newAttachments.map((file, index) => (
                                            <li
                                                key={index}
                                                className="py-3 flex justify-between items-center"
                                            >
                                                <div className="flex items-center">
                                                    <PaperClipIcon className="h-5 w-5 text-gray-400" />
                                                    <span className="ml-2 text-sm text-gray-900">
                                                        {file.name}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewAttachment(
                                                            index
                                                        )
                                                    }
                                                    className="ml-4 text-sm text-red-600 hover:text-red-500"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/work-entries/${id}`)}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Entry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkEntryEdit;
