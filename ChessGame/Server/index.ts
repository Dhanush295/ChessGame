import express, { json } from "express";
import cors from "cors";
import login from "./routes/signup";
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', login )


app.listen(3000, ()=> console.log("Server listening on port: 3000"))