import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import User from "../models/user.model.js";
import Message from './../models/message.model.js';

//Load the List of users for the Sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    //Fetching all users , except the LoggedIn(current) User
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error fetching all users from DB : ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//Load the Chat between two users
export const getMessages = async (req, res) => {
  try {
    //The id with whom we are chatting 
    const { id: userToChatId } = req.params;
    //Our ID
    const myId = req.user._id;

    //Find All Messages where we are the sender and other person is reciever or Vice versa
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    })

    //Return all the messages
    res.status(200).json(messages);

  } catch (error) {
    console.log("Error fetching Messages from DB : ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //Realtime Message Sending Functionality
    const receiverSocketId = getReceiverSocketId(receiverId);

    //Send the msgs only to the receiver, not everyone 
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};





