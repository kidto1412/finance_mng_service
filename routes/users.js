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
    const users = await prisma.user.create({
      data: {
        name: newData.name,
        email: newData.email,
        username: newData.username,
        password: hashedPassword,
        bank: null,
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

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const hashedPassword = await bcrypt.hash(newData.password, saltRounds);
    const users = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: newData.name,
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
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Login Error" });
  }
});

module.exports = router;
