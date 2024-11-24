import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { ApiError } from "../utils/ApiError.js";
import { db } from "../db/index.js";
import { UserTable } from "../models/users.schema.js";


/**
 * Fetch a user from the database by their ID using Drizzle
 * @param {number} userId - The ID of the user to fetch
 * @returns {Promise<any>} - The user record
 */
const findUserById = async (userId) => {
  const user = await db.select().from(UserTable).where(UserTable.id.eq(id));
  return user[0]; // Drizzle returns an array, so pick the first element
};

/**
 * Initialize the socket.io connection for voice calling
 * @param {Server} io - The Socket.IO server instance
 */
const initializeSocketIO = (io) => {
  const activeUsers = {};

  return io.on("connection", async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      const token = cookies?.accessToken || socket.handshake.auth?.token;

      if (!token) {
        throw new ApiError(401, "Unauthorized handshake. Token is missing");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await findUserById(decodedToken?._id);

      if (!user) {
        throw new ApiError(401, "Unauthorized handshake. Token is invalid");
      }

      socket.user = user;
      activeUsers[user.id] = socket;

      socket.join(user.id.toString());
      socket.emit("connected", { success: true, userId: user.id });
      console.log(`User connected: userId=${user.id}`);

      // Handle WebRTC signaling
      socket.on("webrtc_signal", (data) => {
        const targetSocket = activeUsers[data.target];
        if (targetSocket) {
          console.log(`Forwarding WebRTC signal from userId=${user.id} to userId=${data.target}`);
          targetSocket.emit("webrtc_signal", {
            sender: user.id,
            signal: data.signal,
          });
        } else {
          socket.emit("webrtc_error", {
            message: `User ${data.target} is not available`,
          });
        }
      });

      // Handle call initiation
      socket.on("call_user", (data) => {
        const targetSocket = activeUsers[data.target];
        if (targetSocket) {
          console.log(`User ${user.id} is calling ${data.target}`);
          targetSocket.emit("call_user", {
            caller: user.id,
          });
        } else {
          socket.emit("call_response", {
            response: "offline",
          });
        }
      });

      // Handle call response
      socket.on("call_response", (data) => {
        const callerSocket = activeUsers[data.caller];
        if (callerSocket) {
          console.log(`Call response from userId=${user.id} to callerId=${data.caller}: ${data.response}`);
          callerSocket.emit("call_response", {
            response: data.response,
            responder: user.id,
          });
        }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User disconnected: userId=${user.id}`);
        delete activeUsers[user.id];
        socket.leave(user.id.toString());
      });
    } catch (error) {
      socket.emit("error", {
        message: error?.message || "Something went wrong while connecting to the socket.",
      });
    }
  });
};

/**
 * Emit an event to a specific user
 * @param {import("express").Request} req - Express request object
 * @param {string} userId - ID of the target user
 * @param {string} event - Event type
 * @param {any} payload - Data payload
 */
const emitSocketEvent = (req, userId, event, payload) => {
  req.app.get("io").to(userId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
