import React, { useState } from 'react';
import { Ticket, NewTicketInput } from '../types/ticket'; // Import Ticket and NewTicketInput

interface TicketFormProps {
    ticket?: Ticket | null; // Optional for add mode
    onSubmit: (ticket: Ticket | NewTicketInput) => void; // Can submit a full Ticket or a NewTicketInput
    onCancel: () => void;
}

interface FormErrors {
    title?: string;
    description?: string;
}

const TicketForm: React.FC<TicketFormProps> = React.memo(({ ticket, onSubmit, onCancel }) => {
    const [title, setTitle] = useState<string>(ticket?.title || '');
    const [description, setDescription] = useState<string>(ticket?.description || '');
    const [priority, setPriority] = useState<Ticket['priority']>(ticket?.priority || 'Medium');
    const [status, setStatus] = useState<Ticket['status']>(ticket?.status || 'Open');
    const [errors, setErrors] = useState<FormErrors>({});

    const isEditMode = !!ticket;

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (isEditMode && ticket) {
            onSubmit({
                id: ticket.id,
                title,
                description,
                priority,
                status,
                createdAt: ticket.createdAt
            } as Ticket);
        } else {
            onSubmit({
                title,
                description,
                priority,
                status,
            } as NewTicketInput);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? 'Edit Ticket' : 'Add New Ticket'}</h2>

            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter ticket title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y`}
                    placeholder="Provide a detailed description of the issue or task"
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label htmlFor="priority" className="block text-gray-700 text-sm font-semibold mb-2">Priority</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Ticket['priority'])}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
                {isEditMode && (
                    <div>
                        <label htmlFor="status" className="block text-gray-700 text-sm font-semibold mb-2">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Ticket['status'])}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {isEditMode ? 'Update Ticket' : 'Create Ticket'}
                </button>
            </div>
        </form>
    );
});

export default TicketForm;