/**
 * RAAHI Real-Time Socket.io Guide Dispatch Handler
 * Manages live GPS location tracking, nearby guide radar broadcasts, and instant booking state synchronization.
 */

const setupDispatchHandler = (io) => {
  // Store connected active socket sessions: { socketId -> { userId, role, location, isOnline } }
  const activeSockets = new Map();

  io.on('connection', (socket) => {
    console.log(`[RAAHI Socket] Client Connected: ${socket.id}`);

    // Register User Context
    socket.on('user:register', (data) => {
      if (data && data.userId) {
        socket.userId = data.userId;
        socket.role = data.role || 'tourist';
        activeSockets.set(socket.id, {
          socketId: socket.id,
          userId: data.userId,
          role: data.role,
          name: data.name,
          location: data.location || { lng: 75.8185, lat: 26.9124 }
        });
        socket.join(`user:${data.userId}`);
        console.log(`[RAAHI Socket] User Registered: ${data.name} (${data.role}) -> Room: user:${data.userId}`);
      }
    });

    // Guide Location Update Broadcast
    socket.on('guide:update_location', (data) => {
      const session = activeSockets.get(socket.id);
      if (session) {
        session.location = data.location;
        activeSockets.set(socket.id, session);
      }

      // Broadcast live guide coordinate update to all connected tourists
      io.emit('radar:guide_moved', {
        guideId: data.guideId || socket.userId,
        location: data.location,
        isOnline: data.isOnline !== undefined ? data.isOnline : true
      });
    });

    // Tourist On-Demand Trip Request (Broadcast to nearby guides)
    socket.on('trip:request_nearby', (tripData) => {
      console.log(`[RAAHI Dispatch] New Trip Request from Tourist: ${tripData.touristName}`);
      
      // Broadcast dispatch alert to all connected guides
      io.emit('dispatch:new_request', {
        bookingId: tripData.bookingId || `REQ-${Date.now()}`,
        touristId: tripData.touristId,
        touristName: tripData.touristName,
        meetingPoint: tripData.meetingPoint || 'Hawa Mahal Main Gate',
        hoursCount: tripData.hoursCount || 3,
        estimatedFare: tripData.estimatedFare || 1350,
        createdAt: new Date().toISOString()
      });
    });

    // Guide Accept Trip Request
    socket.on('trip:accept', (data) => {
      console.log(`[RAAHI Dispatch] Guide Accepted Trip: ${data.bookingId} by Guide ${data.guideName}`);
      
      // Notify tourist in their private room
      io.to(`user:${data.touristId}`).emit('trip:status_updated', {
        bookingId: data.bookingId,
        status: 'ACCEPTED',
        guideId: data.guideId,
        guideName: data.guideName,
        guidePhone: data.guidePhone || '+91 98290 12345',
        startOtp: data.startOtp || '4892',
        message: `${data.guideName} accepted your request and is heading to the meeting point!`
      });
    });

    // Guide Reject Trip Request
    socket.on('trip:reject', (data) => {
      console.log(`[RAAHI Dispatch] Guide Declined Trip: ${data.bookingId}`);
      io.to(`user:${data.touristId}`).emit('trip:status_updated', {
        bookingId: data.bookingId,
        status: 'REJECTED',
        message: 'Guide was unable to accept. Searching for next available verified guide...'
      });
    });

    // Disconnect Handler
    socket.on('disconnect', () => {
      activeSockets.delete(socket.id);
      console.log(`[RAAHI Socket] Client Disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupDispatchHandler;
