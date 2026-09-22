import { Booking, CreateBookingData } from "@/types/booking";
import { api } from "./api";

export const createBooking = async (
  data: CreateBookingData,
) => {
  const response = await api.post(
    '/api/booking/request/',
    data,
  );

  return response.data;
};


export const updateBookingStatus = async (
  bookingId: number,
  status: 'accepted' | 'declined',
) => {
  const response = await api.patch(
    `/api/booking/${bookingId}/action/`,
    {
      status,
    },
  );

  return response.data;
};



export const getTalentBookings = async (): Promise<Booking[]> => {
  const response = await api.get<Booking[]>(
    '/api/booking/talent/',
  );

  return response.data;
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const response = await api.get<Booking[]>(
    '/api/booking/my-bookings/',
  );

  return response.data;
};



