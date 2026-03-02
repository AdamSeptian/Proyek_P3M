import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const ProfilOrganisasi = db.define(
  "profil_organisasi",{
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
      validate: {
        notEmpty: true,
      },
    },
    judul_berita: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    isi_berita: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    status: {
        type: DataTypes.ENUM("pending", "rejected", "verified"),
        defaultValue: "pending",
        allowNull: false,
        validate: {
          notEmpty:true
        }
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
    }},
  {
    freezeTableName: true,
  }
);

Users.hasMany(ProfilOrganisasi, {
  foreignKey: "users_uuid",
});

ProfilOrganisasi.belongsTo(Users, {
  foreignKey: "users_uuid",
});
export default ProfilOrganisasi;