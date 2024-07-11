import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import sanitizeHtml from 'sanitize-html';
import cookieParser from 'cookie-parser';
import fs from 'fs';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.use(cors());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);



const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://unpkg.com",
        "https://kit.fontawesome.com",
        "'unsafe-inline'"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://unpkg.com",
        "https://kit.fontawesome.com",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: ["'self'", "data:", "https://kit.fontawesome.com"],
      connectSrc: [
        "'self'",
        "https://ka-f.fontawesome.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
        "https://kit.fontawesome.com",
        "https://ka-f.fontawesome.com",
        "https://unpkg.com",
        "data:"
      ],
    },
  },
};

app.use(helmet(helmetConfig));

const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });

const contactFormSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: Number },
  subject: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

const Contact = mongoose.model("contact", contactFormSchema);


app.get("/", (req, res) => {
  const csrfToken = req.csrfToken();
  const section = req.query.section;

  fs.readFile(join(__dirname, "index.html"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading index.html:", err);
      return res.status(500).send("Internal Server Error");
    }

    let htmlWithCsrf = data.replace('<input type="hidden" name="_csrf">', `<input type="hidden" name="_csrf" value="${csrfToken}">`);

    if (section === "contact") {
      htmlWithCsrf = htmlWithCsrf.replace("</body>", `<script>window.location.hash = "#contact";</script></body>`);
    }

    res.send(htmlWithCsrf);
  });
});


app.post("/", async (req, res) => {
  try {
    const { fullName, email, phoneNo, subject, message } = req.body;
    const contact = new Contact({
      fullName: sanitizeHtml(fullName),
      email: sanitizeHtml(email),
      phoneNo: phoneNo ? sanitizeHtml(phoneNo) : undefined,
      subject: sanitizeHtml(subject),
      message: sanitizeHtml(message)
    });
    const contactReceived = await contact.save();
    if (contactReceived) {
      console.log("New contact message saved:", contactReceived);
      res.clearCookie("_csrf");
      return res.sendFile(join(__dirname, "success.html"));
    } else {
      console.log("No contact saved");
      res.clearCookie("_csrf");
      return res.sendFile(join(__dirname, "failure.html"));
    }
  } catch (err) {
    console.error("Error saving contact:", err);
    return res.sendFile(join(__dirname, "failure.html"));
  }
});


app.listen(port, () => {
  console.log(`Server running on ${port}, http://localhost:${port}`);
});

