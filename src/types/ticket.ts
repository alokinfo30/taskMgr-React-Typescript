export interface Ticket {
    id: string; // Unique ID
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    createdAt: Date; // Changed from Firebase Timestamp to Date
}

/**
 * Defines the structure for a new ticket being created.
 * 'Omit' removes 'id' and 'createdAt' as they are generated internally.
 * 'status' is optional as it has a default.
 */
export type NewTicketInput = Omit<Ticket, 'id' | 'createdAt'> & {
    status?: 'Open'; // Optional for input, as it has a default
};
