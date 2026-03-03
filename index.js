import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";
import db from "./config/Database.js";

import UserRoute from "./routes/UserRoute.js";
import BeritaRoute from "./routes/BeritaRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import AnggotaRoute from "./routes/AnggotaRoute.js";
import ProfilOrganisasiRoute from "./routes/ProfilOrganisasiRoute.js";
import LaporanRoute from "./routes/LaporanRoute.js";
import AgendaRoute from "./routes/AgendaRoute.js";
import PengurusRoute from "./routes/PengurusRoute.js";

dotenv.config();

const app = express();

// session store
const SequelizeStoreSession = SequelizeStore(session.Store);

const store = new SequelizeStoreSession({
  db: db,
});

// middleware session
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

// cors (ubah nanti sesuai domain frontend)
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(FileUpload());
app.use(express.json());

// static folder
app.use("/storage", express.static("storage"));

// routes
app.use(UserRoute);
app.use(BeritaRoute);
app.use(AuthRoute);
app.use(AnggotaRoute);
app.use(ProfilOrganisasiRoute);
app.use(LaporanRoute);
app.use(AgendaRoute);
app.use(PengurusRoute);

// start server + koneksi database
const PORT = process.env.PORT || process.env.APP_PORT || 5000;

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected");

    await store.sync();

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