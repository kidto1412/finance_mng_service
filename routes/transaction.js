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
        title: newData.title,
        date: newData.date,
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

router.get("/get-transaction", async (req, res, next) => {
  try {
    const param = req.params;
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: param.userId,
        bankId: param.bankId,
      },
    });
    res.status(200).json({
      code: "00",
      data: transactions,
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: "An error occurred while creating the users" });
  }
});

router.post("/add-transaction", async (req, res, next) => {
  try {
    const request = req.body;

    const useBank = await prisma.bank_user.findFirst({
      include: {
        bank: true,
      },
      where: {
        userId: request.userId,
        bankId: request.bankId,
      },
    });

    const transactions = await prisma.transaction.create({
      data: {
        title: request.title,
        date: request.date,
        userId: parseInt(request.userId),
        bankId: parseInt(request.bankId),
        amount: parseInt(request.amount),
        categoryId: parseInt(request.categoryId),
        type: request.type,
      },
    });
    let total = 0;
    const balanceBank = parseInt(useBank.totalBalance);
    total = balanceBank - parseInt(request.amount);
    const updateBalance = await prisma.bank_user.update({
      data: {
        totalBalance: parseInt(total),
      },
      where: {
        userId_bankId: {
          userId: parseInt(request.userId),
          bankId: parseInt(request.bankId),
        },
      },
    });
    console.log(total);
    console.log(updateBalance);
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
