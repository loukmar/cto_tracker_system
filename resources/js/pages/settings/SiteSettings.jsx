import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { PhotoIcon } from "@heroicons/react/24/outline";

const SiteSettings = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            site_name: "",
            site_description: "",
            site_email: "",
            timezone: "Asia/Vientiane",
            date_format: "Y-m-d",
            time_format: "H:i",
            week_starts_on: "monday",
        },
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get("/api/settings");
            const settings = response.data;

            reset({
                site_name: settings.site_name || "CTO Tracking System",
                site_description: settings.site_description || "",
                site_email: settings.site_email || "",
                timezone: settings.timezone || "Asia/Vientiane",
                date_format: settings.date_format || "Y-m-d",
                time_format: settings.time_format || "H:i",
                week_starts_on: settings.week_starts_on || "monday",
            });

            if (settings.site_logo) {
                setLogoPreview(`/storage/${settings.site_logo}`);
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setMessage("");
            setError("");

            const formData = new FormData();

            // Append all form fields
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            // Append logo if selected
            if (logo) {
                formData.append("site_logo", logo);
            }

            await axios.post("/api/settings", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("Settings saved successfully");

            // Refresh the page to update any cached settings
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    const removeLogo = async () => {
        try {
            await axios.delete("/api/settings/logo");
            setLogo(null);
            setLogoPreview(null);
            setMessage("Logo removed successfully");
        } catch (err) {
            setError("Failed to remove logo");
        }
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Site Settings
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                    Configure system-wide preferences and branding
                </p>

                {message && (
                    <div className="mt-4 rounded-md bg-green-50 p-4">
                        <p className="text-sm font-medium text-green-800">
                            {message}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-4 rounded-md bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-800">
                            {error}
                        </p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 space-y-6"
                >
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                General Settings
                            </h3>

                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                {/* Site Logo */}
                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Site Logo
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo"
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <PhotoIcon className="h-12 w-12 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="ml-5">
                                            <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                                                <span>Change logo</span>
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                />
                                            </label>
                                            {logoPreview && (
                                                <button
                                                    type="button"
                                                    onClick={removeLogo}
                                                    className="ml-3 text-sm text-red-600 hover:text-red-500"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG up to 2MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Site Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register("site_name")}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Site Description
                                    </label>
                                    <textarea
                                        {...register("site_description")}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Brief description of your site"
                                    />
                                </div>

                                <div className="sm:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Site Email
                                    </label>
                                    <input
                                        type="email"
                                        {...register("site_email")}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="admin@example.com"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Timezone
                                    </label>
                                    <select
                                        {...register("timezone")}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="Asia/Vientiane">
                                            Asia/Vientiane
                                        </option>
                                        <option value="Asia/Bangkok">
                                            Asia/Bangkok
                                        </option>
                                        <option value="Asia/Singapore">
                                            Asia/Singapore
                                        </option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Week Starts On
                                    </label>
                                    <select
                                        {...register("week_starts_on")}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="sunday">Sunday</option>
                                        <option value="monday">Monday</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date Format
                                    </label>
                                    <select
                                        {...register("date_format")}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="Y-m-d">
                                            2024-12-25
                                        </option>
                                        <option value="d/m/Y">
                                            25/12/2024
                                        </option>
                                        <option value="m/d/Y">
                                            12/25/2024
                                        </option>
                                        <option value="d-m-Y">
                                            25-12-2024
                                        </option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Time Format
                                    </label>
                                    <select
                                        {...register("time_format")}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="H:i">
                                            24-hour (14:30)
                                        </option>
                                        <option value="h:i A">
                                            12-hour (2:30 PM)
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Settings"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SiteSettings;
