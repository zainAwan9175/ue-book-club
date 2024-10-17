import express from "express";
const router = express.Router();
import { createbook, deleteBook, editBook ,getAllBooks,getBookById} from "../controlers/admincontroler.js"; // Corrected the import path and removed duplicates

// Route to create a book
router.post("/createbook",createbook);

// Route to delete a book by ID
router.delete("/deletebook/:id", deleteBook); // Use DELETE method and include ID in the route

// Route to edit a book by ID
router.put("/editbook/:id", editBook); // Use PUT method and include ID in the route

router.get("/getAllBooks", getAllBooks);
router.get("/getBookById/:id",getBookById);
export { router as adminRoute };
