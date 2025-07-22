import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
    HomeIcon,
    UsersIcon,
    DocumentTextIcon,
    ChartBarIcon,
    CogIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BuildingOfficeIcon,
    TagIcon,
    CheckCircleIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Layout = () => {
    const { user, logout, isAdmin, isCTO } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [siteSettings, setSiteSettings] = useState({
        site_name: "CTO Tracking System",
        site_logo: null,
    });

    useEffect(() => {
        fetchSiteSettings();
    }, []);

    const fetchSiteSettings = async () => {
        try {
            const response = await axios.get("/api/settings/public");
            setSiteSettings(response.data);
        } catch (error) {
            console.error("Error fetching site settings:", error);
        }
    };

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
        { name: "Work Entries", href: "/work-entries", icon: DocumentTextIcon },
        { name: "Departments", href: "/departments", icon: BuildingOfficeIcon },
        { name: "Work Types", href: "/work-types", icon: TagIcon },
        { name: "Statuses", href: "/statuses", icon: CheckCircleIcon },
        { name: "KPI", href: "/kpi", icon: ChartBarIcon },
        { name: "Reports", href: "/reports", icon: ChartBarIcon },
    ];

    if (isAdmin || isCTO) {
        navigation.push({ name: "Users", href: "/users", icon: UsersIcon });
    }

    if (isAdmin) {
        navigation.push({ name: "Settings", href: "/settings", icon: CogIcon });
    }

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const UserAvatar = ({ size = "h-8 w-8", textSize = "text-sm" }) => {
        if (user?.avatar) {
            return (
                <img
                    src={
                        user.avatar.startsWith("http")
                            ? user.avatar
                            : `/storage/${user.avatar}`
                    }
                    alt={user.name}
                    className={`${size} rounded-full object-cover`}
                />
            );
        }
        return (
            <div
                className={`${size} rounded-full bg-gray-300 flex items-center justify-center`}
            >
                <span className={`${textSize} font-medium text-gray-600`}>
                    {user?.name?.charAt(0).toUpperCase()}
                </span>
            </div>
        );
    };

    const SiteLogo = ({ className = "h-8 w-auto" }) => {
        if (siteSettings.site_logo) {
            return (
                <img
                    src={`/storage/${siteSettings.site_logo}`}
                    alt={siteSettings.site_name}
                    className={className}
                />
            );
        }
        return (
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                    {siteSettings.site_name.charAt(0)}
                </span>
            </div>
        );
    };

    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50 lg:hidden"
                        onClose={setSidebarOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button
                                                type="button"
                                                className="-m-2.5 p-2.5"
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }
                                            >
                                                <span className="sr-only">
                                                    Close sidebar
                                                </span>
                                                <XMarkIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                        <div className="flex h-16 shrink-0 items-center gap-x-3">
                                            <SiteLogo />
                                            <h1 className="text-xl font-bold text-gray-900">
                                                {siteSettings.site_name}
                                            </h1>
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul
                                                role="list"
                                                className="flex flex-1 flex-col gap-y-7"
                                            >
                                                <li>
                                                    <ul
                                                        role="list"
                                                        className="-mx-2 space-y-1"
                                                    >
                                                        {navigation.map(
                                                            (item) => (
                                                                <li
                                                                    key={
                                                                        item.name
                                                                    }
                                                                >
                                                                    <Link
                                                                        to={
                                                                            item.href
                                                                        }
                                                                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                                                        onClick={() =>
                                                                            setSidebarOpen(
                                                                                false
                                                                            )
                                                                        }
                                                                    >
                                                                        <item.icon
                                                                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                                                                            aria-hidden="true"
                                                                        />
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                                <li className="mt-auto">
                                                    <Link
                                                        to="/profile"
                                                        className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 rounded-md"
                                                    >
                                                        <UserAvatar />
                                                        <span>
                                                            {user?.name}
                                                        </span>
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600 w-full"
                                                    >
                                                        <ArrowRightOnRectangleIcon
                                                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                                                            aria-hidden="true"
                                                        />
                                                        Sign out
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center gap-x-3">
                            <SiteLogo />
                            <h1 className="text-xl font-bold text-gray-900">
                                {siteSettings.site_name}
                            </h1>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul
                                role="list"
                                className="flex flex-1 flex-col gap-y-7"
                            >
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                                >
                                                    <item.icon
                                                        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 rounded-md"
                                    >
                                        <UserAvatar />
                                        <span className="sr-only">
                                            Your profile
                                        </span>
                                        <span aria-hidden="true">
                                            {user?.name}
                                        </span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600 w-full"
                                    >
                                        <ArrowRightOnRectangleIcon
                                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                                            aria-hidden="true"
                                        />
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            <div className="flex flex-1"></div>
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
                                >
                                    <UserAvatar />
                                    <span className="hidden lg:flex lg:items-center">
                                        <span aria-hidden="true">
                                            {user?.name}
                                        </span>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default Layout;
