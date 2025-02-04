var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("hello");
  console.log(secretKey);
});

router.post("/register", async (req, res, next) => {
  try {
    const newData = req.body;
    const hashedPassword = await bcrypt.hash(newData.password, saltRounds);
    const dataUser = await prisma.user.findUnique({
      where: {
        username: newData.username,
      },
    });
    if (dataUser == null) {
      const users = await prisma.user.create({
        data: {
          name: newData.name,
          email: newData.email,
          username: newData.username,
          password: hashedPassword,
        },
      });
      // Fetch all default categories
      const defaultCategories = await prisma.category.findMany({
        where: {
          userId: null, // Assuming default categories have userId as null
        },
      });
      const userCategories = await defaultCategories.map((category) => ({
        userId: users.id,
        categoryId: category.id,
      }));
      await prisma.user_category.createMany({
        data: userCategories,
      });
      res.status(200).json({
        code: "00",
        data: users.id,
        message: "Success",
      });
    } else {
      res.status(200).json({
        code: "40",
        data: "Failed",
        message: "Username already exist",
      });
    }
    console.log(dataUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "99",
      data: null,
      message: "Failed",
    });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const hashedPassword = await bcrypt.hash(newData.password, saltRounds);
    const users = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: newData.name,
        email: newData.email,
        username: newData.username,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      code: "00",
      data: "Execute",
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: "An error occurred while creating the users" });
  }
});

router.post("/login", async (req, res, next) => {
  const dataUser = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: dataUser.username,
      },
    });

    if (!user) {
      return res.status(401).send({
        error: "Invalid username or password",
      });
    }
    const passwordMatch = await bcrypt.compare(
      dataUser.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).send({
        error: "Invalid username or password",
      });
    }
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

    res.status(200).send({
      code: "00",
      message: "Success",
      data: user.id,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Login Error" });
  }
});

module.exports = router;
