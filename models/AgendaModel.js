import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
const { DataTypes } = Sequelize;

const Agendas = db.define(
  "agendas",{
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
    nama_kegiatan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    tuan_rumah: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    jadwal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
        notEmpty: true,
        isDate: true,
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
    file: {
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
Users.hasMany(Agendas, {
  foreignKey: "users_uuid",
});

Agendas.belongsTo(Users, {
  foreignKey: "users_uuid",
});
export default Agendas;