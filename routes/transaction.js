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

    const banks = await prisma.bank.create({
      data: {
        bankName: newData.bankName,
        totalBalance: newData.totalBalance,
        userId: users.id,
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

module.exports = router;
