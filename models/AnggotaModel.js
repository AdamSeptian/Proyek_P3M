import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Anggotas = db.define(
  "anggotas",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    users_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "users",
            key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gelar: {
      type: DataTypes.STRING,
      allowNull: false,
        validate: {
        notEmpty: true,
      },
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: false,
        validate: {
        notEmpty: true,
        },
    },
    masa_jabat: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        notEmpty: true,
        },
    },
    instansi: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        notEmpty: true,
        },
    },
    linkedin: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    google_scholar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    scopus: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sinta: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    }
  },
  {
    freezeTableName: true,
  }
);

export default Anggotas;
