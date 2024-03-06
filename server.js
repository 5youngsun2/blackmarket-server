const express = require("express");
const cors = require("cors");
const models = require("./models");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "upload/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());
app.use("/upload", express.static("upload"));

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["name", "ASC"]],
    attributes: [
      "id",
      "name",
      "price",
      "createdAt",
      "seller",
      "imageUrl",
      "soldout",
    ],
  })
    .then((result) => {
      console.log("Product : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러 발생");
    });
});

app.get("/banners", (req, res) => {
  models.Banner.findAll({ limit: 2 })
    .then((result) => {
      res.send({ banners: result });
    })
    .catch((error) => {
      console.error(error);
      req.status(500).send("에러가 발생했습니다.");
    });
});

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.Product.update(
    {
      soldout: 1,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((result) => {
      res.send({ result: true });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, price, seller, description, imageUrl } = body;

  if (!name || !description || !price || !seller || !imageUrl) {
    //방어코드
    res.status(400).send("모든 정보를 입력해주세요.");
  }

  models.Product.create({
    name: name,
    description: description,
    price: price,
    seller: seller,
    imageUrl: imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발새하였습니다.");
    });
});

app.get("/product/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log(result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회 에러가 발생하였습니다.");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);

  res.send({
    imageUrl: file.path.replace("\\", "/"),
  });
});

app.listen(port, () => {
  console.log("쇼핑몰 서버가 동작중입니다.");

  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((error) => {
      console.error(error);
      console.log("DB 연결 에러");
      process.exit();
    });
});
