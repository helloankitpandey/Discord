import  express  from "express";
import userroute from "./routes/user.routes";
import { config } from "dotenv";

config();

const app = express();

app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies


app.use("/user", userroute);

app.listen(process.env.PORT, () => {
    console.log("Successfully Running");
} )

// crud-operation krna hai
// read-get
// creat-post
// updated-put
// delete-delete