import { BookingStatus } from '@raahi/shared-types';

export class BookingStateMachineService {
  private static allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
    IDLE: ['SERVICE_SELECTED', 'SEARCHING'],
    SERVICE_SELECTED: ['LOCATION_CONFIRMED', 'SEARCHING', 'CANCELLED'],
    LOCATION_CONFIRMED: ['FARE_CALCULATED', 'SEARCHING', 'CANCELLED'],
    FARE_CALCULATED: ['SEARCHING', 'CANCELLED'],
    SEARCHING: ['MATCHED', 'CANCELLED'],
    MATCHED: ['GUIDE_EN_ROUTE', 'OTP_PENDING', 'CANCELLED'],
    GUIDE_EN_ROUTE: ['GUIDE_ARRIVED', 'CANCELLED'],
    GUIDE_ARRIVED: ['OTP_PENDING', 'CANCELLED'],
    OTP_PENDING: ['TRIP_STARTED', 'CANCELLED'],
    TRIP_STARTED: ['TRIP_COMPLETED', 'CANCELLED'],
    TRIP_COMPLETED: [],
    CANCELLED: []
  };

  public static isValidTransition(current: BookingStatus, next: BookingStatus): boolean {
    const allowed = this.allowedTransitions[current] || [];
    return allowed.includes(next);
  }
}
