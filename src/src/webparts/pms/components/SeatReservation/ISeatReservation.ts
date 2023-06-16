export interface SeatReservationState {
    selectedSeat: string | null,
    cardsPerRow: number;
    selectedLocation: string;
    dropdownOptions: any,
    selectedDate: any;
    showSuccessModal: boolean;
    msg: string;
    bookedSlots: BookedSlots[]
}

export interface SeatReservationProps {
    showHomeFun?: any;
}

export interface Reservation {
    Author: any;
    ID: number;
    BookingDate: any;
    Location: string;
    Slot: string;
}

export interface BookedSlots {
    Location: string;
    Slot: string;
}

export interface ViewReservationsProps {
    showHomeFun?: any;
}

export interface ViewReservationsState {
    reservations: Reservation[];
    pastBookings: Reservation[];
    upcomingBookings: Reservation[];
}

export interface AdminModuleProps {
    showHomeFun?: any;
}

export interface AdminModuleState {
    reservations: Reservation[];
    upcomingBookings: Reservation[];
}