import { Router } from "express";
import { userModel } from "../models/users.models.js";

const sessionRouter = Router();

sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("llego al server");
    /* consultamos si la sesion esta activa o no */
    if (req.session.login) {
      res.status(200).send({ resultado: "login ya existente" });
    }
    const user = await userModel.findOne({ email: email });

    if (user) {
      if (user.password == password) {
        req.session.login = true;
        req.session.user = {
          nombre: user.first_name,
          rol: user.rol,
        };
        res.redirect("./views/productos.handlebars", 200, { info: "user" });
      } else {
        res
          .status(401)
          .send({ resultado: "contraseña no valida", message: password });
      }
    } else {
      res.status(404).send({ resultado: "usuario no existe", message: user });
    }
  } catch (error) {
    res.status(400).send({ error: `error en el login: ${error}` });
  }
});

sessionRouter.get("/logout", async (req, res) => {
  if (req.session.login) {
    /* si la sesion esta activa la eliminamos */
    req.session.destroy();
  }
  res.status(200).send({ resultado: "usuario deslogeado" });
});

export default sessionRouter;
