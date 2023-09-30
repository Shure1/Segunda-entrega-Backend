import { Router } from "express";
import { userModel } from "../models/users.models.js";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.post(
  "/login",
  passport.authenticate("login"),
  async (req, res) => {
    try {
      /* si passport no me entrega un user */
      if (!req.user) {
        return res.status(401).send({ mensaje: "usuario invalido" });
      }

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
      };
      res.status(200).send({ playload: req.user });
    } catch (error) {
      res.status(500).send({ mensaje: `error al iniciar sesion ${error}` });
    }
    /* const { email, password } = req.body;

  try {
    console.log("llego al server"); */
    /* consultamos si la sesion esta activa o no */
    /* if (req.session.login) {
      res.status(200).send({ resultado: "login ya existente" });
    }
    const user = await userModel.findOne({ email: email });
    console.log(user);

    if (user) {
      if (user.password == password) {
        req.session.login = true;
        req.session.user = {
          nombre: user.first_name,
          rol: user.rol,
        };
        res.render("productos");
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
  } */
  }
);

sessionRouter.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    try {
      /* si passport no me entrega un user */
      if (!req.user) {
        return res.status(400).send({ mensaje: "usuario ya existente" });
      }

      res.status(200).send({ mensaje: "usuario creado" });
    } catch (error) {
      res.status(500).send({ mensaje: `error al registrar usuario ${error}` });
    }
  }
);

//el scope nos sirve para declarar que el user sera el email que ya esta registrado en github
sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.status(200).send({ mensaje: "usuario registrado" });
  }
);

sessionRouter.get(
  "/githubCallback",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    req.session.user = req.user;
    res.status(200).send({ mensaje: "usuario logeado" });
  }
);

sessionRouter.get("/logout", async (req, res) => {
  if (req.session.login) {
    /* si la sesion esta activa la eliminamos */
    req.session.destroy();
  }
  res.status(200).send({ resultado: "usuario deslogeado" });
});

export default sessionRouter;
