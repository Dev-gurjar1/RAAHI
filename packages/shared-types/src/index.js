"use strict";
/**
 * RAAHI — Shared Type Definitions & Data Models
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvents = void 0;
// Socket Events Definition
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["BOOKING_CREATED"] = "booking:created";
    SocketEvents["BOOKING_SEARCHING"] = "booking:searching";
    SocketEvents["BOOKING_MATCHED"] = "booking:matched";
    SocketEvents["GUIDE_ACCEPTED"] = "guide:accepted";
    SocketEvents["GUIDE_LOCATION"] = "guide:location";
    SocketEvents["GUIDE_ARRIVED"] = "guide:arrived";
    SocketEvents["TRIP_STARTED"] = "trip:started";
    SocketEvents["TRIP_COMPLETED"] = "trip:completed";
    SocketEvents["BOOKING_CANCELLED"] = "booking:cancelled";
    SocketEvents["GUIDE_REQUEST"] = "guide:request";
    SocketEvents["NOTIFICATION_NEW"] = "notification:new";
})(SocketEvents || (exports.SocketEvents = SocketEvents = {}));
//# sourceMappingURL=index.js.map