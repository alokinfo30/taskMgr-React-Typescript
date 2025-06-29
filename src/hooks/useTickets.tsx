import { useState, useEffect, useCallback, useReducer } from 'react';
import { Ticket, NewTicketInput } from '../types/ticket'; // Import Ticket and NewTicketInput
import { ticketReducer } from '../reducers/ticketReducer'; // Import the ticketReducer

// Simulate a database/API delay
const SIMULATED_DELAY = 500; // milliseconds

interface UseTicketsReturn {
    tickets: Ticket[];
    loading: boolean;
    error: string | null;
    addTicket: (newTicket: NewTicketInput) => Promise<void>;
    updateTicket: (ticketId: string, updatedData: Partial<Omit<Ticket, 'id' | 'createdAt'>>) => Promise<void>;
    deleteTicket: (ticketId: string) => Promise<void>;
}

// In-memory storage for tickets
let inMemoryTickets: Ticket[] = []; // This will persist across useTickets hook calls

const useTickets = (userId: string | null, isAuthReady: boolean): UseTicketsReturn => {
    // We use useReducer for managing the tickets state within this hook,
    // reflecting changes from the inMemoryTickets array.
    const [tickets, dispatch] = useReducer(ticketReducer, []);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Simulate initial data fetch
    useEffect(() => {
        if (!isAuthReady || !userId) {
            console.log("App not ready or userId not available for ticket operations.");
            setLoading(true);
            return;
        }

        // Simulate fetching tickets
        setLoading(true);
        const timer = setTimeout(() => {
            // Filter tickets by userId if needed for multi-user in-memory simulation,
            // otherwise just dispatch all inMemoryTickets
            const userTickets = inMemoryTickets.filter(ticket =>
                (ticket as any).assignedTo === userId // Assuming 'assignedTo' for user association
            );
            dispatch({ type: 'SET_TICKETS', payload: userTickets });
            setLoading(false);
            setError(null);
        }, SIMULATED_DELAY);

        return () => clearTimeout(timer);
    }, [userId, isAuthReady]); // Re-run effect if userId or auth readiness changes

    const addTicket = useCallback(async (newTicketData: NewTicketInput) => {
        if (!userId) {
            setError("User not identified for adding tickets.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY)); // Simulate network delay

            const newId = crypto.randomUUID();
            const createdTicket: Ticket = {
                id: newId,
                ...newTicketData,
                createdAt: new Date(), // Set current date
                status: newTicketData.status || 'Open', // Default status if not provided
                // Simulate assigning to current user for in-memory persistence
                assignedTo: userId // Add an 'assignedTo' property for in-memory user filtering
            } as Ticket; // Cast to Ticket for type compatibility

            inMemoryTickets.push(createdTicket); // Add to in-memory storage
            dispatch({ type: 'ADD_TICKET', payload: createdTicket }); // Update local state via reducer
            setLoading(false);
        } catch (err: any) {
            console.error("Error adding ticket:", err);
            setError(`Failed to add ticket: ${err.message || 'Unknown error'}`);
            setLoading(false);
        }
    }, [userId]);

    const updateTicket = useCallback(async (ticketId: string, updatedData: Partial<Omit<Ticket, 'id' | 'createdAt'>>) => {
        if (!userId) {
            setError("User not identified for updating tickets.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY)); // Simulate network delay

            const ticketIndex = inMemoryTickets.findIndex(t => t.id === ticketId && (t as any).assignedTo === userId);

            if (ticketIndex > -1) {
                const oldTicket = inMemoryTickets[ticketIndex];
                const updatedTicket: Ticket = {
                    ...oldTicket,
                    ...updatedData,
                    id: ticketId // Ensure ID is preserved
                };
                inMemoryTickets[ticketIndex] = updatedTicket; // Update in-memory storage
                dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket }); // Update local state via reducer
            } else {
                throw new Error("Ticket not found or not authorized to update.");
            }
            setLoading(false);
        } catch (err: any) {
            console.error("Error updating ticket:", err);
            setError(`Failed to update ticket: ${err.message || 'Unknown error'}`);
            setLoading(false);
        }
    }, [userId]);

    const deleteTicket = useCallback(async (ticketId: string) => {
        if (!userId) {
            setError("User not identified for deleting tickets.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY)); // Simulate network delay

            const initialLength = inMemoryTickets.length;
            inMemoryTickets = inMemoryTickets.filter(t => t.id !== ticketId || (t as any).assignedTo !== userId);

            if (inMemoryTickets.length === initialLength) {
                throw new Error("Ticket not found or not authorized to delete.");
            }

            dispatch({ type: 'DELETE_TICKET', payload: ticketId }); // Update local state via reducer
            setLoading(false);
        } catch (err: any) {
            console.error("Error deleting ticket:", err);
            setError(`Failed to delete ticket: ${err.message || 'Unknown error'}`);
            setLoading(false);
        }
    }, [userId]);

    return { tickets, loading, error, addTicket, updateTicket, deleteTicket };
};

export { useTickets };