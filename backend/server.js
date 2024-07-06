import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/getData", (req, res) => {
  res.send("Data from Backend");
});

app.listen(5000, () => console.log("Backend is Running..."));
