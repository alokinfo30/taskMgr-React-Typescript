import React from 'react';
import { Ticket } from '../types/ticket'; // Import the centralized Ticket type

interface TicketListProps {
    tickets: Ticket[]; // This uses the imported Ticket
    onSelectTicket: (ticket: Ticket) => void;
    onAddNewTicket: () => void;
}

const TicketList: React.FC<TicketListProps> = React.memo(({ tickets, onSelectTicket, onAddNewTicket }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Tickets</h2>
                <button
                    onClick={onAddNewTicket}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    + Add New Ticket
                </button>
            </div>
            {tickets.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No tickets found. Add your first ticket!</p>
            ) : (
                <div className="overflow-y-auto pr-2 -mr-2 flex-grow">
                    {tickets.map(ticket => (
                        <div
                            key={ticket.id}
                            className="bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.01]"
                            onClick={() => onSelectTicket(ticket)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                                <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                                        ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                                        ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {ticket.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{ticket.description}</p>
                            <div className="text-xs text-gray-500 flex justify-between">
                                <span>Priority: <span className="font-medium">{ticket.priority}</span></span>
                                {ticket.createdAt && (
                                    <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default TicketList;