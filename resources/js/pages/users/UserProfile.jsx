import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const schema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().nullable(),
    current_password: yup.string().when("new_password", {
        is: (value) => value && value.length > 0,
        then: (schema) =>
            schema.required(
                "Current password is required when changing password"
            ),
    }),
    new_password: yup.string().min(8, "Password must be at least 8 characters"),
    new_password_confirmation: yup
        .string()
        .oneOf([yup.ref("new_password"), null], "Passwords must match"),
});

const UserProfile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        },
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setMessage("");
            setError("");

            const response = await axios.put("/api/profile", data);
            setUser(response.data);
            setMessage("Profile updated successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await axios.post("/api/profile/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUser({ ...user, avatar: response.data.avatar });
            setMessage("Avatar uploaded successfully");
        } catch (err) {
            setError("Failed to upload avatar");
        }
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Profile Settings
                </h1>

                <div className="mt-6 max-w-3xl">
                    {message && (
                        <div className="mb-4 rounded-md bg-green-50 p-4">
                            <p className="text-sm font-medium text-green-800">
                                {message}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <p className="text-sm font-medium text-red-800">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Personal Information
                            </h3>

                            {/* Avatar Section */}
                            <div className="mt-6 flex items-center">
                                <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                    {user?.avatar ? (
                                        <img
                                            src={
                                                user.avatar.startsWith("http")
                                                    ? user.avatar
                                                    : `/storage/${user.avatar}`
                                            }
                                            alt=""
                                            className="h-20 w-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserCircleIcon className="h-16 w-16 text-gray-500" />
                                    )}
                                </div>
                                <div className="ml-5">
                                    <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                                        <span>Change avatar</span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG up to 2MB
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="mt-6 space-y-6"
                            >
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            {...register("name")}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            {...register("email")}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            {...register("phone")}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.department?.name || ""}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                                        />
                                    </div>

                                    <div className="sm:col-span-6">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Change Password
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Leave blank to keep current password
                                        </p>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            {...register("current_password")}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.current_password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors.current_password
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            {...register("new_password")}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.new_password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.new_password.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            {...register(
                                                "new_password_confirmation"
                                            )}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.new_password_confirmation && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors
                                                        .new_password_confirmation
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
