import React, { useState, useEffect, useCallback } from 'react';

import { useTickets } from './hooks/useTickets';
import { useModal } from './hooks/useModal';

import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import TicketDetail from './components/TicketDetail';
import Modal from './components/Modal';
import ErrorBoundary from './components/ErrorBoundary';

// Import the centralized Ticket type
import { Ticket, NewTicketInput } from './types/ticket';

const App: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const [view, setView] = useState<'list' | 'add' | 'detail' | 'edit'>('list');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const { tickets, loading, error, addTicket, updateTicket, deleteTicket } = useTickets(userId, isAuthReady);
    const { isOpen: isModalOpen, modalContent, openModal, closeModal } = useModal();

    // Simplified authentication: just set a random user ID on mount
    useEffect(() => {
        // Simulate immediate authentication by setting a random user ID
        const currentUserId = crypto.randomUUID();
        setUserId(currentUserId);
        setIsAuthReady(true);
        console.log("In-memory authentication: User ID:", currentUserId);

        // No cleanup needed for in-memory authentication
    }, []);

    const handleSelectTicket = useCallback((ticket: Ticket) => {
        setSelectedTicket(ticket);
        setView('detail');
    }, []);

    const handleAddNewTicket = useCallback(() => {
        setSelectedTicket(null);
        setView('add');
    }, []);

    const handleBackToList = useCallback(() => {
        setSelectedTicket(null);
        setView('list');
    }, []);

    const handleEditTicket = useCallback((ticket: Ticket) => {
        setSelectedTicket(ticket);
        setView('edit');
    }, []);

    const handleSaveTicket = useCallback(async (ticketData: Ticket | NewTicketInput) => {
        if ((ticketData as Ticket).id) {
            // It's an existing ticket for update
            await updateTicket((ticketData as Ticket).id, ticketData as Partial<Omit<Ticket, 'id' | 'createdAt'>>);
        } else {
            // It's a new ticket for add
            await addTicket(ticketData as NewTicketInput);
        }
        handleBackToList();
    }, [addTicket, updateTicket, handleBackToList]);

    const handleDeleteTicket = useCallback((ticketId: string) => {
        openModal(
            <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to delete this ticket?</p>
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={closeModal}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            await deleteTicket(ticketId);
                            closeModal();
                            handleBackToList();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }, [deleteTicket, handleBackToList, openModal, closeModal]);

    if (!isAuthReady || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-inter text-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
                <p className="ml-4 text-lg text-gray-700">Loading application...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-inter text-gray-900">
                <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-2">Error!</h2>
                    <p className="text-sm">{error}</p>
                    <p className="text-xs mt-2">Please check your internet connection or try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-inter text-gray-900 flex flex-col items-center">
                <header className="w-full max-w-4xl bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-indigo-700">Ticket Hub</h1>
                    {userId && (
                        <p className="text-sm text-gray-600">
                            User ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded-md text-xs sm:text-sm break-all">{userId}</span>
                        </p>
                    )}
                </header>

                <main className="w-full max-w-4xl flex-grow flex flex-col">
                    {view === 'list' && (
                        <TicketList
                            tickets={tickets}
                            onSelectTicket={handleSelectTicket}
                            onAddNewTicket={handleAddNewTicket}
                        />
                    )}
                    {view === 'add' && (
                        <TicketForm
                            onSubmit={handleSaveTicket}
                            onCancel={handleBackToList}
                        />
                    )}
                    {view === 'detail' && selectedTicket && (
                        <TicketDetail
                            ticket={selectedTicket}
                            onBack={handleBackToList}
                            onEdit={handleEditTicket}
                            onDelete={handleDeleteTicket}
                        />
                    )}
                    {view === 'edit' && selectedTicket && (
                        <TicketForm
                            ticket={selectedTicket}
                            onSubmit={handleSaveTicket}
                            onCancel={handleBackToList}
                        />
                    )}
                </main>

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    {modalContent}
                </Modal>
            </div>
        </ErrorBoundary>
    );
}

export default App;