"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStateMachineService = void 0;
class BookingStateMachineService {
    static allowedTransitions = {
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
    static isValidTransition(current, next) {
        const allowed = this.allowedTransitions[current] || [];
        return allowed.includes(next);
    }
}
exports.BookingStateMachineService = BookingStateMachineService;
//# sourceMappingURL=state-machine.js.map