import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(cors());

const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((error) => {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  });

const contactFormSchema = new mongoose.Schema(
  {
    full_name: String,
    email_address: String,
    phone_No: Number,
    subject: String,
    message: String,
  },
  { timestamps: true }
);

const Contact = mongoose.model("contact", contactFormSchema);

app.get("/", (req, res) => {
  const section = req.query.section;
  if (section === "contact") {
    res.redirect("/#contact");
  } else {
    res.sendFile(join(__dirname, "index.html"));
  }
});

app.post("/", async function (req, res) {
  try {
    const contact = new Contact({
      full_name: req.body.fullName,
      email_address: req.body.email,
      phone_No: req.body.phoneNo,
      subject: req.body.subject,
      message: req.body.message,
    });
    let contactReceived = await contact.save();
    if (contactReceived) {
      console.log("You have a new contact message");
      res.sendFile(join(__dirname, "success.html"));
    } else {
      console.log("No coontact saved");
      res.sendFile(join(__dirname, "failure.html"));
    }
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port}, http://localhost:${port}`);
});
