import React from 'react';
import { Link } from 'react-router-dom';
import { 
    BuildingOfficeIcon,
    TagIcon,
    CheckCircleIcon,
    ChevronRightIcon 
} from '@heroicons/react/24/outline';

const Categories = () => {
    const categories = [
        {
            title: 'Departments',
            description: 'Manage organization departments',
            icon: BuildingOfficeIcon,
            href: '/departments',
            color: 'bg-blue-500'
        },
        {
            title: 'Work Types',
            description: 'Manage different types of work activities',
            icon: TagIcon,
            href: '/work-types',
            color: 'bg-green-500'
        },
        {
            title: 'Statuses',
            description: 'Manage work entry statuses',
            icon: CheckCircleIcon,
            href: '/statuses',
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Manage system categories and classifications
                </p>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            key={category.title}
                            to={category.href}
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${category.color}`}>
                                        <category.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {category.title}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {category.description}
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

export default Categories;