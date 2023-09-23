import { fileURLToPath } from "url";
import { dirname } from "path";

//ocupamos este js para que se adapte a los diferentes quipos y sistemas operativos para acceder a archivos

const __filename = fileURLToPath(import.meta.url); //consultamos el nombre del archivo local

export const __dirname = dirname(__filename); //devuelve el directorio actual en donde se encuentra path.js
