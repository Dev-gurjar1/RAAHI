import { BookingStatus } from '@raahi/shared-types';
export declare class BookingStateMachineService {
    private static allowedTransitions;
    static isValidTransition(current: BookingStatus, next: BookingStatus): boolean;
}
//# sourceMappingURL=state-machine.d.ts.map