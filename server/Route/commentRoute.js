import express from "express";
const router = express.Router();
import {createcomment,deletecomment,getAllComments ,getcommentById,getcommentByBookId } from "../controlers/commentcontroler.js"; 

router.post("/createcomment",createcomment);


router.delete("/deletecomment/:id",deletecomment ); 

router.get("/getcommentByBookId/:id",getcommentByBookId ); 
router.get("/getAllComments",getAllComments ); 
router.get("/getcommentById/:id",getcommentById );
export { router as commentRoute };
