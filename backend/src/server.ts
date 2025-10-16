import express, { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from your Node.js backend!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
