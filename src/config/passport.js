import "dotenv/config";
import local, { Strategy } from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import passport from "passport";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import { userModel } from "../models/users.models.js";

//TODO done es un return en donde tiene 2 params el primero es algun error si no hay nada ponemos null, y al usuario y objeto creado, si no creamos nada ponemos false

//defino mi estrategia a utilizar
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
//ExtractJWT nos sirve para extraer las coockies el token
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  /* funcion que capta las cookies desde el cliente */
  const cookieExtractor = (req) => {
    console.log(req.cookies.jwtCookie);
    const token = req.cookies.jwtCookie ? req.cookies.jwtCookie : {};
    console.log("cookieExtractor", token);

    return token;
  };

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        //avisamos de que el token proviene desde cookieExtractor
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),

        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        //jwt_payload contiene la info del token
        try {
          //si existe la info del token se envia si no error
          console.log("JWT", jwt_payload);
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      {
        /* devuelvo como callback todo lo que envie */ passReqToCallback: true,
        /* que me tome el email como si fuera el username */
        usernameField: "email",
      },
      async (req, username, password, done) => {
        /* registramos al usuario */
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: email });
          if (user) {
            /* se encontro el user, por lo tanto va false porque ya esta creado */
            return done(null, false);
          }

          /* caso en el que el user no existe lo creamos */
          //encriptamos las pass
          const passwordHash = createHash(password);

          //lo enviamos a la BDD
          const userCreated = await userModel.create({
            first_name: first_name,
            last_name: last_name,
            age: age,
            email: email,
            password: passwordHash,
          });
          return done(null, userCreated);
        } catch (error) {
          /* es done es un return implicito que utiliza passport */
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email", //ponemos el email como username
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          console.log(user);
          /* caso en que el user no exista al logearse */
          if (!user) {
            console.log("no se encontro el user");

            return done(null, false);
          }
          console.log(validatePassword(password, user.password));
          console.log(typeof user.password);
          console.log(typeof password);

          /* caso en que el user si existe */
          if (validatePassword(password, user.password)) {
            console.log("las claves son validas");
            //a la izq ponemos lo que me envia el usuario y a la der lo que tengo en la BDD
            return done(null, user);
          }
          console.log("datos invalidos");
          /* caso en que los datos son invalidos */
          return done(null, false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.SECRET_CLIENT,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          console.log(accesToken);
          console.log(refreshToken);
          console.log(profile);
          const user = await userModel.findOne({ email: profile._json.email });
          if (user) {
            done(null, false);
          } else {
            const userCreated = await userModel.create({
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: 18,
              password: createHash(profile._json.email + profile._json.name),
            });
            done(null, userCreated);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
  //iniciamos la sesion del user, le tenemos que indicar cual es el atributo unico con el que se inicia la sesion (en nuestro caso el id)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  /* eliminamos la sesion con el id  */
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
