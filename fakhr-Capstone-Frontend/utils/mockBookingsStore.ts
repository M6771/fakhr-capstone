export type MockBookingRecord = {
  id: string;
  listingName: string;
  dateLabel: string;
  timeLabel: string;
  patientName: string;
  phone: string;
  notes?: string;
  createdAt: string;
};

const bookings: MockBookingRecord[] = [];

export function saveMockBooking(record: Omit<MockBookingRecord, "id" | "createdAt">) {
  const full: MockBookingRecord = {
    ...record,
    id: `bk_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  bookings.push(full);
  return full;
}

export function getMockBookings(): MockBookingRecord[] {
  return [...bookings];
}
