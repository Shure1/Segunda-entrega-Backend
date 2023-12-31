import { Router } from "express";
import { productModel } from "../models/products.models.js";
import { PaginationParameters } from "mongoose-paginate-v2";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  let { limit, page, sort, category, status } = req.query;
  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;
  console.log("llego a products api");

  try {
    let paramsPaginate = {
      limit,
      page,
      sort,
    };
    let consultaQuery = {
      ...(category && { category }),
      ...(status && { status }),
    };
    if (sort) {
      sort === "asc"
        ? (paramsPaginate.sort = { price: 1 })
        : (paramsPaginate.sort = { price: -1 });
    }
    console.log(consultaQuery);

    const prods = await productModel.paginate(consultaQuery, paramsPaginate);
    res.render("products", { prods });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consultar productos", mensaje: error });
  }
});

productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await productModel.findById(id);
    if (prod) res.status(200).send({ respuesta: "OK", mensaje: prod });
    else
      res.status(404).send({
        respuesta: "Error en consultar Producto",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consulta producto", mensaje: error });
  }
});

productRouter.post("/", async (req, res) => {
  const { title, description, stock, code, price, category } = req.body;
  try {
    const prod = await productModel.create({
      title,
      description,
      stock,
      code,
      price,
      category,
    });
    res.status(200).send({ respuesta: "OK", mensaje: prod });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en crear productos", mensaje: error });
  }
});

productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, stock, status, code, price, category } = req.body;

  try {
    const prod = await productModel.findByIdAndUpdate(id, {
      title,
      description,
      stock,
      status,
      code,
      price,
      category,
    });
    if (prod)
      res
        .status(200)
        .send({ respuesta: "OK", mensaje: "Producto actualizado" });
    else
      res.status(404).send({
        respuesta: "Error en actualizar Producto",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en actualizar producto", mensaje: error });
  }
});

productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await productModel.findByIdAndDelete(id);
    if (prod)
      res.status(200).send({ respuesta: "OK", mensaje: "Producto eliminado" });
    else
      res.status(404).send({
        respuesta: "Error en eliminar Producto",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en eliminar producto", mensaje: error });
  }
});

export default productRouter;
