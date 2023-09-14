import express from "express";

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log("app running on port: 3333")
});

app.get("/", (req, res) => {
    res.send("hello world!")
});