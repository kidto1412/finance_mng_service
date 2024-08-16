var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* GET users listing. */
router.get("/userId/:id", async (req, res, next) => {
  try {
    const request = req.params;
    const { id } = req.params;
    const response = await prisma.user_category.findMany({
      include: {
        category: true,
      },
      where: {
        userId: parseInt(id),
      },
    });
    const newResponse = response.map((item) => ({
      ...item,
      categoryName: item.category.name, // Menambahkan properti categoryName
    }));
    console.log(newResponse);
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

router.get("/", async (req, res, next) => {
  try {
    const response = await prisma.category.findMany();
    const newResponse = response.map((item) => {
      return {
        categoryId: item.id,
        categoryName: item.name,
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

router.post("/add", async (req, res, next) => {
  try {
    const newData = req.body;

    const category = await prisma.category.create({
      data: {
        name: newData.name,
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

router.post("/add-user-category", async (req, res, next) => {
  try {
    const newData = req.body;

    const categoryUser = await prisma.user_category.create({
      data: {
        userId: parseInt(newData.userId),
        categoryId: parseInt(newData.categoryId),
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

module.exports = router;
