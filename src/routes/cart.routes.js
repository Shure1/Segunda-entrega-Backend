import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

const cartRouter = Router();

cartRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await cartModel.findById(id);
    if (cart) res.status(200).send({ respuesta: "OK", mensaje: cart });
    else
      res.status(404).send({
        respuesta: "Error en consultar Carrito",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consulta carrito", mensaje: error });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({});
    res.status(200).send({ respuesta: "OK", mensaje: cart });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en crear Carrito", mensaje: error });
  }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      const prod = await productModel.findById(pid); //Busco si existe en LA BDD, no en el carrito

      if (prod) {
        const indice = cart.products.findIndex((item) => item.id_prod == pid); //Busco si existe en el carrito
        if (indice != -1) {
          cart.products[indice].quantity = quantity; //Si existe en el carrito modifico la cantidad
        } else {
          cart.products.push({ id_prod: pid, quantity: quantity }); //Si no existe, lo agrego al carrito
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart); //Actualizar el carrito
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error en agregar producto Carrito",
          mensaje: "Produt Not Found",
        });
      }
    } else {
      res.status(404).send({
        respuesta: "Error en agregar producto Carrito",
        mensaje: "Cart Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ respuesta: "Error en agregar producto Carrito", mensaje: error });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      const prod = await productModel.findById(pid);
      if (prod) {
        const indice = cart.products.findIndex((item) => item.id_prod == pid);
        if (indice != -1) {
          const nuevoArray = cart.products.filter(
            (prods) => prods != cart.products[indice]
          );
          cart.products = [...nuevoArray];
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error en eliminar producto del Carrito",
          mensaje: "Product Not Found",
        });
      }
    } else {
      res.status(404).send({
        respuesta: "Error en eliminar producto del Carrito",
        mensaje: "carr Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      respuesta: "Error en eliminar producto del Carrito",
      mensaje: error,
    });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { productsNews } = req.body;

  try {
    const cart = await cartModel.findById(cid);
    /* verificamos si existe el carrito */
    if (cart) {
      /* obtenemos los Ids de los productos ingresados en postman */
      const productsIds = productsNews.map((product) => product.id);

      /* obtenemos los id de mongo con los que ingresamos */
      const products = await productModel.find({ _id: { $in: productsIds } });
      /* si existen todos los productos ingresados en postman en mongo lo agregamos  */
      if (products.length === productsIds.length) {
        /* construimos el array a ingresar  */
        const newProducts = productsNews.map((products) => {
          const product = products.find((p) => p.id === productsNews.id);
          return {
            id_prod: product.id,
            quantity: productsNews.quantity,
          };
        });
        cart.products = [...newProducts];
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "error",
          mensaje: "alguno de los productos no encontrados",
        });
      }
    } else {
      res
        .status(404)
        .send({ respuesta: "Error", mensaje: "Carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ respuesta: "Error", mensaje: "Error interno del servidor" });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartModel.findById(cid);
    /* verificamos si existe el carrito */
    if (cart) {
      const prod = await productModel.findById(pid);
      if (prod) {
        const indice = cart.products.findIndex((prod) => {
          const idProd = prod.id_prod.toString();
          return idProd === pid;
        });
        console.log(indice);
        if (indice != -1) {
          cart.products[indice].quantity = quantity;
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, {
          products: cart.products,
        });
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error en modificar producto del Carrito",
          mensaje: "Produt Not Found",
        });
      }
    } else {
      res.status(404).send({
        respuesta: "Error en encontrar Carrito",
        mensaje: "carr Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      respuesta: "Error en actualizar cantidad del producto",
      mensaje: error,
    });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  const cart = await cartModel.findById(cid);
  if (cart) {
    cart.products = [];
    const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
    res.status(200).send({ respuesta: "OK", mensaje: respuesta });
  } else {
    res.status(404).send({
      respuesta: "Error en agregar producto Carrito",
      mensaje: "Cart Not Found",
    });
  }
});
export default cartRouter;
