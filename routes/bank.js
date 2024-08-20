var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;

/* GET users listing. */
router.get("/all", async (req, res, next) => {
  try {
    const banks = await prisma.bank.findMany();
    const newBanks = banks.map((item) => ({
      bankId: item.id,
      bankName: item.bankName,
    }));
    res.status(200).json({
      code: "00",
      data: newBanks,
      message: "Success",
    });
  } catch (e) {
    res.status(500).json({
      code: "99",
      data: null,
      message: "Failed",
    });
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const newData = req.body;

    const banks = await prisma.bank.create({
      data: {
        bankName: newData.bankName,
      },
    });
    res.status(200).json({
      code: "00",
      data: "Execute",
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "99",
      data: null,
      message: "Failed",
    });
  }
});

router.get("/get-bank-user", async (req, res, next) => {
  try {
    const newData = req.query;

    const existBank = await prisma.bank_user.findFirst({
      where: {
        bankId: parseInt(newData.bankId),
        userId: parseInt(newData.userId),
      },
    });

    if (!existBank) {
      return res.status(400).json({
        code: "01",
        message: "Data notfound",
      });
    }

    res.status(200).json({
      code: "00",
      data: existBank,
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "99",
      data: null,
      message: "Failed",
    });
  }
});

router.post("/add-bank-user", async (req, res, next) => {
  try {
    const newData = req.body;

    const existBank = await prisma.bank_user.findFirst({
      where: {
        bankId: parseInt(newData.bankId),
        userId: parseInt(newData.userId),
      },
    });

    console.log(existBank);
    // Jika sudah ada, berikan pesan error
    if (existBank) {
      return res.status(400).json({
        code: "01",
        message: "Bank already  exist",
      });
    }

    const banks = await prisma.bank_user.create({
      data: {
        userId: parseInt(newData.userId),
        bankId: parseInt(newData.bankId),
        totalBalance: parseInt(newData.totalBalance),
      },
    });
    res.status(200).json({
      code: "00",
      data: "Execute",
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "99",
      data: null,
      message: "Failed",
    });
  }
});

router.put("/edit-bank-user/bankId/:bankId", async (req, res, next) => {
  try {
    const currentBankId = parseInt(req.params.bankId);
    const newData = req.body;

    const banks = await prisma.bank_user.update({
      where: {
        userId_bankId: {
          userId: parseInt(newData.userId),
          bankId: currentBankId,
        },
      },
      data: {
        bankId: parseInt(newData.bankId),
        totalBalance: parseInt(newData.totalBalance),
      },
    });
    res.status(200).json({
      code: "00",
      data: "Updated",
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "99",
      data: null,
      message: "Failed",
    });
  }
});

router.get("/userId/:userId", async function (req, res, next) {
  try {
    const request = req.params;
    console.log(request);
    const response = await prisma.bank_user.findMany({
      include: {
        bank: true,
      },
      where: {
        userId: parseInt(request.userId),
      },
    });
    const newResponse = response.map((item) => {
      return {
        ...item,
        bankName: item.bank.bankName,
      };
    });
    res.status(200).json({
      code: "00",
      data: newResponse,
      message: "Success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: "99",
      data: null,
      message: "Failed",
    });
  }
});

module.exports = router;
