export interface CreateBookingData {
  talent: number;
  event_title?: string;
  event_description?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  venue_address: string;
  offered_rate?: string;
  currency: string;
  phone_number:string
}


export interface Booking {
  id: number;
  client_username: string;
  talent_stage_name: string;
  talent: number;
  event_title: string | null;
  event_description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  venue_address: string;
  offered_rate: string | null;
  currency: string;
  status:
    | 'pending'
    | 'accepted'
    | 'declined'
    | 'cancelled'
    | 'completed';
  created_at: string;
}

