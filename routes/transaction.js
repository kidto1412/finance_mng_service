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

router.post("/", async (req, res, next) => {
  try {
    const newData = req.body;

    const transactions = await prisma.transaction.create({
      data: {
        title: newData.bankName,
        date: newData.totalBalance,
        bankId: newData.bankId,
        userId: newData.userId,
        amount: newData.amount,
        type: newData.type,
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
