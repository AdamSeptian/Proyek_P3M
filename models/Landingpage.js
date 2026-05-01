import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const LandingPage = db.define('LandingPage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'home'
  },
  // Kolom Hero: Menyimpan array of objects (image, title, desc)
  hero: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: { slides: [] }
  },
  // Kolom Tradition: Sesuai response JSON kamu
  tradition: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Kolom Footer: Menyimpan socials, multiple contacts, dan multiple addresses
  footer: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      emailMarketing: "",
      emailInfo: "",
      socials: [],
      contacts: [], // Untuk menampung banyak nama/nomor
      addresses: [] // Untuk menampung banyak lokasi sekretariat
    }
  }
}, {
  timestamps: true,
  tableName: 'landing_pages'
});

export default LandingPage;