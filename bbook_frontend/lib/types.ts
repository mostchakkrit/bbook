export type Room = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
};

export type Booking = {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  room: { name: string };
  user: { firstName: string; lastName: string; email: string };
};
