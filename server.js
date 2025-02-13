import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import http from "http";
import app from "./app.js";
import { error } from "console";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import porjectModal from "../backend/modals/project.model.js";
import { generateResult } from "./services/ai.sevices.js";

const server = http.createServer(app);

const port = process.env.PORT || 3000;

// const server = require('http').createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


io.use(async (socket, next) => {
  try {
    // Extract token from the handshake headers
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectid = socket.handshake.query.projectid;

    if (!mongoose.Types.ObjectId.isValid(projectid)) {
      return next(new Error("Invalid Project ID"));
    }

    socket.project = await porjectModal.findById(projectid);

    // Validate token existence
    if (!token) {
      return next(new Error("Authentication error: Token is required"));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if (!decoded) {
      return next(new Error("Authentication error: Invalid token"));
    }

    // Attach the user info to the socket object for later use
    socket.user = decoded;

    // Proceed to the next middleware or connection
    next();
  } catch (error) {
    console.error("Socket authentication error:", error.message);
    next(new Error("Authentication error: " + error.message)); // Inform the client of the specific error
  }
});

io.on("connection", (socket) => {

socket.roomId = socket.project._id.toString();
  
  console.log("A user connected:", socket.id);

  socket.join(socket.roomId);

  socket.on("project-message",async (data) => {
    console.log(data);

    const message = data.message; 
    
    console.log("messaga" , message);
     
    const isAIPresentedInMessage = message.includes('@ai'); 

    if(isAIPresentedInMessage){
      console.log("Ai is present in the message!");

      const propmt = message.replace('@ai' , ''); 
      const result = await generateResult(propmt);
      socket.broadcast.to(socket.roomId).emit("project-message", data);

      io.to(socket.roomId).emit('project-message', {
        
        message : result,
        sender : {
          _id : 'ai', 
        email : 'AI'
        }
      })
      
      // socket.emit('project-message' ,{
      //   sender : data.sender,
      //   message : 'AI is Presend in the message'
      // })
      return;
    }
    
  
    // Broadcast the event to the room identified by the project ID

  });
  

  socket.on("event", (data) => {
    console.log("Event received:", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:");
    socket.leave(socket.roomId);
  });
});



// server.listen(process.env.PORT || 3000);

server.listen(port, () => {
  console.log("Your server is live! at " + port);
});
