import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";

//handlebars
import { engine } from "express-handlebars";

//socket io
import { Server } from "socket.io";

import { __dirname } from "./path.js";

import path from "path";

//modulo de rutas
import userRouter from "./routes/users.routes.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import sessionRouter from "./routes/session.routes.js";

const app = express();
const PORT = 4000;

const serverExpress = app.listen(PORT, () => {
  console.log(`Server on Port ${PORT}`);
});

//?MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //para que podamos trabajar con querys largas

//?MIDLEWARES DE HANDLEBARS
app.engine("handlebars", engine()); //Defino que motor de plantillas voy a utilizar y su config
app.set("view engine", "handlebars"); //Setting de mi app de hbs
app.set("views", path.resolve(__dirname, "./views")); //Resolver rutas absolutas a traves de rutas relativas
app.use("/static", express.static(path.join(__dirname, "/public"))); //me evito el problema de la ruta en diferentes sist operativos u otros pc y sirve para ocupar la carpeta public para el handlebars

const io = new Server(serverExpress);

mongoose
  .connect(
    "mongodb+srv://erodriguezp2:Shure200.@cluster0.qhlv3mx.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(async () => {
    console.log("BDD conectada");
    //Filtro -
    /* const resultado = await cartModel.findOne({
      _id: "64ffd7d6e68f421a1319fd8d",
    }); */

    /* const resultado = await productModel.paginate(
      { category: "fiambres" },
      { limit: 1, page: 1, sort: { price: "1" } }
    );
    console.log(JSON.stringify(resultado.docs)); */

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

//Guardamos sesiones en la BDD
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://erodriguezp2:Shure200.@cluster0.qhlv3mx.mongodb.net/?retryWrites=true&w=majority", //es la url que usa useNewUrlParser
      mongoOptions: {
        useNewUrlParser: true, //establecemos conexion mediante url
        useUnifiedTopology: true, //manejo de clusters de manera dinamica, nos conectamos al controlador actual de base de datos
      },
      ttl: 60, //duracion de la sesion en la BDD en seg
    }),
    secret: "coder",
    //fuerzo a que intente guardar a pesar de no tener modificaciones en los datos
    resave: false,
    //fuerzo a que la sesion guarde un valor (id) al menos
    saveUninitialized: false,
  })
);

app.get("/static", (req, res) => {
  res.render("home", {
    css: "style.css",
    js: "home.js",
  });
});

//?RUTAS
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionRouter);
