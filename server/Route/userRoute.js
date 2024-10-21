import express from "express";
import { createUser } from "../controlers/usercontroler.js";

const router = express.Router();
router.post("/create", createUser);

export { router as userRoute };
