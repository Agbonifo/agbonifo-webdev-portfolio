/*
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
*/


import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import rateLimit from "express-rate-limit";
import csrf from "csurf";
import helmet from "helmet";
import sanitizeHtml from "sanitize-html";
import cookieParser from "cookie-parser";

dotenv.config();


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(join(__dirname, 'public')));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(cors());
app.use(helmet());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

const PORT = process.env.PORT || 3000;
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
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNo: { type: Number, required: true },
      subject: { type: String, required: true },
      message: { type: String, required: true }
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


app.post('/', csrfProtection, async function (req, res) {
  try {
    if (!req.body['g-recaptcha-response']) {
      return res.status(400).send('CAPTCHA verification failed.');
    }

    const fullName = sanitizeHtml(req.body.fullName);
    const email = sanitizeHtml(req.body.email);
    const phoneNo = sanitizeHtml(req.body.phoneNo);
    const subject = sanitizeHtml(req.body.subject);
    const message = sanitizeHtml(req.body.message);

    const contact = new Contact({
      fullName,
      email,
      phoneNo,
      subject,
      message
    });

    let contactReceived = await contact.save();
    if (contactReceived) {
      console.log("You have a new contact message");
      res.sendFile(join(__dirname, "success.html"));
    } else {
      console.log("No contact saved");
      res.sendFile(join(__dirname, "failure.html"));
    }
  } catch (err) {
    res.status(500).send('Server error. Please try again later.');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
