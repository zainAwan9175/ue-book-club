import express from "express";
import dotenv from "dotenv";
import {adminRoute} from "./Route/adminRoute.js";
import { commentRoute } from "./Route/commentRoute.js";

const app = express();

import mongodbconnection from "./mongodb-connection.js";
mongodbconnection();
const port = 3001;

// Add middleware to parse JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/admin", adminRoute);
app.use("/comment", commentRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
