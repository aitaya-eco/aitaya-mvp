const express = require("express");
const app = express();
const {auth_router} = require("./routes/auth");
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/auth", auth_router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});