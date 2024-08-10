var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* GET users listing. */
router.get("/:id", async (req, res, next) => {
  try {
    const request = req.params;
    const response = await prisma.category.findUnique({
      where: {
        userId: request.id,
      },
    });
    res.status(200).json({
      code: "00",
      data: response,
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

    const category = await prisma.category.create({
      data: {
        name: newData.name,
        userId: newData.userId,
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
