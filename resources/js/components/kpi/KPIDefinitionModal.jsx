import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const KPIDefinitionModal = ({ kpi, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: kpi?.name || '',
        key: kpi?.key || '',
        unit: kpi?.unit || 'count',
        target: kpi?.target || 0,
        description: kpi?.description || '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const units = [
        { value: 'count', label: 'Count' },
        { value: 'percentage', label: 'Percentage' },
        { value: 'hours', label: 'Hours' },
        { value: 'days', label: 'Days' },
        { value: 'rating', label: 'Rating (1-5)' },
        { value: 'currency', label: 'Currency' },
        { value: 'custom', label: 'Custom' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <form onSubmit={handleSubmit}>
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                    {kpi ? 'Edit KPI' : 'Define New KPI'}
                                                </Dialog.Title>
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                            required
                                                        />
                                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Key (for tracking)</label>
                                                        <input
                                                            type="text"
                                                            name="key"
                                                            value={formData.key}
                                                            onChange={handleChange}
                                                            placeholder="e.g., tasks_completed"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                            required
                                                        />
                                                        {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key[0]}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                                                        <select
                                                            name="unit"
                                                            value={formData.unit}
                                                            onChange={handleChange}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        >
                                                            {units.map((unit) => (
                                                                <option key={unit.value} value={unit.value}>
                                                                    {unit.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Target Value</label>
                                                        <input
                                                            type="number"
                                                            name="target"
                                                            value={formData.target}
                                                            onChange={handleChange}
                                                            step="0.01"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                                        <textarea
                                                            name="description"
                                                            value={formData.description}
                                                            onChange={handleChange}
                                                            rows={3}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : kpi ? 'Update' : 'Create'}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default KPIDefinitionModal;