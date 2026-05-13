import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";
import db from "./config/Database.js";
import jwt from "jsonwebtoken";
import kategoriRoute from "./routes/KategoriRoute.js"
import UserRoute from "./routes/UserRoute.js";
import BeritaRoute from "./routes/BeritaRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import AnggotaRoute from "./routes/AnggotaRoute.js";
import ProfilOrganisasiRoute from "./routes/ProfilOrganisasiRoute.js";
import LaporanRoute from "./routes/LaporanRoute.js";
import AgendaRoute from "./routes/AgendaRoute.js";
import PengurusRoute from "./routes/PengurusRoute.js";
import TagRoute from "./routes/TagRoute.js";
import LandingPageRoute from "./routes/LandingPageRoute.js";
import axios from "axios";

dotenv.config();

const app = express();
const SequelizeStoreSession = SequelizeStore(session.Store);

const store = new SequelizeStoreSession({
  db: db,
});

// --- MIDDLEWARE ---
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(FileUpload());
app.use(express.json());

// --- JWT AUTH EXAMPLES (Bisa ditaruh di Controller nantinya) ---
// Contoh Route Login dengan JWT
app.post('/login-jwt', (req, res) => {
    const { username } = req.body;
    const user = { name: username }; // Idealnya ambil dari DB

    // Generate Token
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    res.json({ accessToken });
});

// --- ROUTES ---
app.use(UserRoute);
app.use(BeritaRoute);
app.use(kategoriRoute);
app.use(TagRoute);
app.use(AuthRoute);
app.use(AnggotaRoute);
app.use(ProfilOrganisasiRoute);
app.use(LaporanRoute);
app.use(AgendaRoute);
app.use(PengurusRoute);
app.use(LandingPageRoute);

// External API Route
app.get('/api/kampus', async (req, res) => {
    try {
        const response = await axios.get('http://universities.hipolabs.com/search?country=Indonesia');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data kampus', error: error.message });
    }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ups! Halaman atau file tidak ditemukan.',
    saran: 'Kembali ke beranda proyek P3M saja ya!'
  });
});

// --- SERVER START & DATABASE CONNECTION ---
const PORT = process.env.PORT || process.env.APP_PORT || 5000;

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected...");

    // Sinkronisasi session store
    await store.sync();

    // Cukup satu app.listen di sini
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect database:", error);
  }
})();
// (async () => {
//   await db.sync({alter: true});
// })();