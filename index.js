import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";
import db from "./config/database.js";
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
const sessionStore = new SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(FileUpload());
app.use(express.json());
app.use(UserRoute);
app.use(BeritaRoute);
app.use(AuthRoute);
app.use(AnggotaRoute);
app.use(ProfilOrganisasiRoute);
app.use(LaporanRoute);
app.use(AgendaRoute);
app.use(PengurusRoute);

// (async () => {
//   await db.sync({alter: true});
// })();

// store.sync();
app.use('/storage', express.static('storage'));

app.listen(process.env.APP_PORT, () => {
  console.log("server is running up");
});