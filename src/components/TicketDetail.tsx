import React, { useMemo } from 'react';
import { Ticket } from '../types/ticket'; // Import the centralized Ticket type

interface TicketDetailProps {
    ticket: Ticket;
    onBack: () => void;
    onEdit: (ticket: Ticket) => void;
    onDelete: (ticketId: string) => void;
}

const TicketDetail: React.FC<TicketDetailProps> = React.memo(({ ticket, onBack, onEdit, onDelete }) => {
    // Memoize the formatted date to avoid recalculations on every render if ticket or locale doesn't change
    const formattedDate = useMemo(() => {
        return ticket.createdAt ? ticket.createdAt.toLocaleString() : 'N/A';
    }, [ticket.createdAt]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex-1 flex flex-col">
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-2 mr-3 transition-colors duration-200"
                    aria-label="Back to tickets"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 flex-grow">Ticket Details</h2>
                <span
                    className={`px-3 py-1 text-base font-semibold rounded-full ${
                        ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}
                >
                    {ticket.status}
                </span>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                <p className="text-xl font-semibold text-gray-900 mb-3">{ticket.title}</p>
                <p className="text-gray-700 mb-6 leading-relaxed">{ticket.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6 border-t border-b border-gray-200 py-4">
                    <div>
                        <span className="font-semibold">Priority:</span> {ticket.priority}
                    </div>
                    <div>
                        <span className="font-semibold">Created At:</span> {formattedDate}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                    onClick={() => onEdit(ticket)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(ticket.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Delete
                </button>
            </div>
        </div>
    );
});

export default TicketDetail;