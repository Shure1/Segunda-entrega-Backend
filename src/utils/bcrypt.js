import "dotenv/config";
import bcrypt from "bcrypt";

/* le pasamos la password a bcrypt para que hashee la libreria */
export const createHash = (pass) =>
  /* SALT es secreto y es un vector de inicializacion de cuantas veces se hashea  */
  bcrypt.hashSync(pass, bcrypt.genSaltSync(parseInt(process.env.SALT)));

/* validamos si la pass que puso el user en el cliente es igual al hash que esta en la BDD */
export const validatePassword = (passUser, passBDD) => {
  return bcrypt.compareSync(passUser, passBDD);
};
