import React from 'react';
import { Link } from 'react-router-dom';
import { 
    TagIcon, 
    BuildingOfficeIcon, 
    CogIcon,
    ChevronRightIcon 
} from '@heroicons/react/24/outline';

const Settings = () => {
    const settingsSections = [
        {
            title: 'Categories',
            description: 'Manage work types, statuses, and departments',
            icon: TagIcon,
            href: '/settings/categories',
            color: 'bg-blue-500'
        },
        {
            title: 'Site Settings',
            description: 'Configure system preferences and options',
            icon: CogIcon,
            href: '/settings/site',
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Manage your system configuration and preferences
                </p>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {settingsSections.map((section) => (
                        <Link
                            key={section.title}
                            to={section.href}
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${section.color}`}>
                                        <section.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {section.title}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {section.description}
                                            </dd>
                                        </dl>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
