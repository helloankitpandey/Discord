import express from "express";
import { createUser, deleteUser, getAllUser, getSingleUser, updateUser } from "../controller/userRoutes";

const userroute = express.Router();

// userroute.get("/", (req, res) => {
//     res.send("Succesfully")
// })
// create a new user 
userroute.post("/post", createUser )
// get all user
userroute.get("/get", getAllUser)
// get user by id
userroute.get("/get/:id", getSingleUser)
// update user 
userroute.put("/:id", updateUser)
// delete user
userroute.delete("/:id", deleteUser)



export default userroute;