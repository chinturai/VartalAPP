import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { app, server } from "./lib/socket.js";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json()) //Used to extract data from body in json format
app.use(cookieParser()); //Used to extract token from the cookie

//To solve the CORS Error
app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
}));
//CORS (Cross-Origin Resource Sharing) error occurs when a web application running in a
//browser, tries to request resources (like API data) from a different domain, and the
//server does not allow it due to security restrictions.

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//For hosting
if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname, "../frontend/dist")));

        app.get("*", (req, res) => {
                res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
        });
}


server.listen(PORT, () => {
        console.log("Server is running on Port : " + PORT);
        connectDB();
});