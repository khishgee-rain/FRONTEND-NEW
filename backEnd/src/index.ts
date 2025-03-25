import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

import cors from "cors";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

app.use(express.json()); 
app.use(cors());


app.use(cors({
  origin: "http://localhost:3000", 
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));



//  Middleware: Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();


});app.post("/add-product", async (req: Request, res: Response) => {
  try {
    const { name, colors, price, quantity, picture } = req.body;

    const colorsArray = Array.isArray(colors) ? colors : colors.split(",").map((color: string) => color.trim());

    const product = await prisma.product.create({
      data: {
        name,
        colors: colorsArray,
        price,
        quantity,
        picture,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
  res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.get("/products", async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/product/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.userData.create({ data: { username, password } });
        res.status(201).json({ message: "User created", user });
    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  prisma.userData.findFirst({
    where: { username },
  }).then((user) => {
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.json({ message: "Login successful", user });
  }).catch((error) => {
    res.status(500).json({ error: "Login failed" });
  });
  });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});