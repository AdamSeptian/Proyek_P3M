import Users from "../models/UserModel.js";
import argon2 from "argon2";

const createAdmin = async () => {
  const hashPassword = await argon2.hash("admin123");

  await Users.create({
    username: "admin",
    email: "admin@mail.com",
    password: hashPassword,
    role: "admin",
    status: "verified",
  });

  console.log("Admin created");
};

createAdmin();
