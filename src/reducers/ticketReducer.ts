import { Ticket } from '../types/ticket'; // Import the centralized Ticket type

// Define action types
type TicketAction =
    | { type: 'SET_TICKETS'; payload: Ticket[] }
    | { type: 'ADD_TICKET'; payload: Ticket }
    | { type: 'UPDATE_TICKET'; payload: Ticket }
    | { type: 'DELETE_TICKET'; payload: string }; // payload is ticketId for delete

// Actions: 'SET_TICKETS', 'ADD_TICKET', 'UPDATE_TICKET', 'DELETE_TICKET'
const ticketReducer = (state: Ticket[], action: TicketAction): Ticket[] => {
    switch (action.type) {
        case 'SET_TICKETS':
            // Sort tickets by createdAt date in descending order
            return action.payload.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        case 'ADD_TICKET':
            // Add new ticket and sort
            return [action.payload, ...state].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        case 'UPDATE_TICKET':
            // Update an existing ticket and sort
            return state.map(ticket =>
                ticket.id === action.payload.id ? action.payload : ticket
            ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        case 'DELETE_TICKET':
            // Filter out the deleted ticket
            return state.filter(ticket => ticket.id !== action.payload);
        default:
            return state;
    }
};

export { ticketReducer };