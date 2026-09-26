/**
 * Server Constants & Enums
 */
export const SocketEvents = {
  BOOKING_CREATED: 'booking:created',
  BOOKING_SEARCHING: 'booking:searching',
  BOOKING_MATCHED: 'booking:matched',
  GUIDE_ACCEPTED: 'guide:accepted',
  GUIDE_LOCATION: 'guide:location',
  GUIDE_ARRIVED: 'guide:arrived',
  TRIP_STARTED: 'trip:started',
  TRIP_COMPLETED: 'trip:completed',
  BOOKING_CANCELLED: 'booking:cancelled',
  GUIDE_REQUEST: 'guide:request',
  NOTIFICATION_NEW: 'notification:new'
};

export const USER_ROLES = ['tourist', 'guide', 'admin', 'campus_ambassador', 'local_host'];

export const BOOKING_STATUSES = [
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled',
  'IDLE',
  'SEARCHING',
  'MATCHED',
  'GUIDE_ARRIVED',
  'TRIP_STARTED',
  'TRIP_COMPLETED'
];
