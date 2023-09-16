import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users.routes.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import { orderModel } from "./models/orders.models.js";
import { userModel } from "./models/users.models.js";
import { cartModel } from "./models/carts.models.js";
import { productModel } from "./models/products.models.js";
const app = express();
const PORT = 4000;

mongoose
  .connect(
    "mongodb+srv://erodriguezp2:pass.@cluster0.qhlv3mx.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(async () => {
    console.log("BDD conectada");
    //Filtro -
    /* const resultado = await cartModel.findOne({
      _id: "64ffd7d6e68f421a1319fd8d",
    });
    const resultado = await userModel.paginate(
      { password: "1234" },
      { limit: 20, page: 1, sort: { edad: "asc" } }
    );
    console.log(JSON.stringify(resultado)); */

    /* const resultados = await orderModel.aggregate([
            {
                $match: { size: 'medium' }
            },
            {
                $group: { _id: "$name", totalQuantity: { $sum: "$quantity" }, totalPrice: { $sum: "$price" } }
            },
            {
                $sort: { totalPrice: 1 } //-1 mayor a menor, 1 menor a mayor
            },
            {
                $group: { _id: 1, orders: { $push: "$$ROOT" } } //$$ROOT el array generado hasta el momento, digase las ordenes de ventas
            },
            {
                $project: { //Generar un nuevo proyecto para guardar en la bdd
                    "_id": 0, //Id autogenerado
                    orders: "$orders"
                }
            },
            {
                $merge: {
                    into: "reports" //Guardo en la coleccion reports en MongoDB Atlas
                }
            }
        ]) */
  })
  .catch(() => console.log("Error en conexion a BDD"));

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => {
  console.log(`Server on Port ${PORT}`);
});
