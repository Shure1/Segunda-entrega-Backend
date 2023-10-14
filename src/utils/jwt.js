import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  /* 
        1° parametro: Objeto asociado al token (Usuario)
        2° parametro: Clave privada para el cifrado
        3° parametro: Tiempo de expiracion
     */

  /* creamos y hacemos un token valido  */
  const token = jwt.sign({ user }, "coderhouse1", {
    expiresIn: "12h",
  });
  console.log(token);
  return token;
};
generateToken({
  _id: "6528316628bc71ff4bfa8063",
  first_name: "elias",
  last_name: "alalal",
  age: 1243,
  email: "test1@mail.com",
  password: "$2b$15$/OH.8Oi.u6BZSPub5abmUuuX/kKxsI.5sihmOw7CTNCn2ZrKXU2UW",
  rol: "user",
});

export const authToken = (req, res, next) => {
  /* consultar al header para obtener el token */
  const authHeader = req.Headers.Authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "usuario no autenticado" });
  }
  /* el param Authorization de Headers tiene dos atributos Bearer y {{jwt_token}}
    nos quedamos con el segundo  */
  const token = authHeader.split(" ")[1];
  /* verificamos si el token es valido */
  jwt.sign(token, process.env.JWT_SECRET, (error, credential) => {
    if (error) {
      return res
        .status(403)
        .send({ error: "usuario no autorizado, token invalido" });
    }
  });
  //usuario valido
  req.user = credential.user;
  next();
};
