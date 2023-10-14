import passport from "passport";

//funcion general para retornar errores en las estrategias de passport ya que tenemos varias estrategias en passport
export const passportError = (strategy) => {
  // enviamos errores de local github o jwt
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error); //que la funcion que se llame maneje como va a responder ante el error
      }
      if (!user) {
        /* info.messages es el error que te envia github o cualquier otra estrategia como google etc, algunos lo envian como obj y otros como string es por eso el condicional en error */
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }

      req.user = user;
      next();
    })(req, res, next); //esto es porque me llama un middleware
  };
};

/* recibo un rol y establezo su capacidad del usuario*/
export const authorization = (rol) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "user no autorizado" });
    }
    /* req.user es la sesion y req.user.user son los datos del user */

    if (req.user.user.rol != rol) {
      return res
        .status(403)
        .json({ error: "usuario no tiene los permisos necesarios" });
    }
    next();
  };
};
