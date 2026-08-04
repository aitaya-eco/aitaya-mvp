const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const { auth_router } = require("./routes/auth/auth");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/auth", auth_router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
