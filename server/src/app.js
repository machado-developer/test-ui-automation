const cors = require("cors");
require("dotenv/config");
const express = require("express");
require("express-async-errors");
const path = require("path");
const morgan = require("morgan");
const { ErrorMiddleware } = require("./middleware/error.middleware.js");
const routes = require("./routes.js");
const session = require("express-session");
const authConfig = require("./config/auth.js");
const fs = require("fs");
const logger = require("./middleware/logger.js");

const accessLogStream = fs.createWriteStream(
  path.join(path.resolve(), "logs/access.log"),
  { flags: "a" }
);

const isDevelopment = process.env.NODE_ENV === "DEVELOPMENT";

class App {
  constructor() {
    this.server = express();
    this.cookieParser = require("cookie-parser");
    this.loggs();
    this.session();
    this.middlewares();
    this.routes();
    this.exceptionError();
  }

  session() {
    this.server.use(
      session({
        secret: authConfig.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 dia
        },
      })
    );
  }

  middlewares() {
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.json());
    this.server.use(this.cookieParser());
    this.server.use(
      cors({
        origin: "http://localhost:5173", // altere para origens confiáveis em produção
        allowedHeaders: "Content-Type, Authorization",
        exposedHeaders: [],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      })
    );
  }

  routes() {
    this.server.use(routes);
  }

  exceptionError() {
    this.server.use(ErrorMiddleware);
  }

  loggs() {
    // Log de requisições no arquivo access.log
    this.server.use(morgan("combined", { stream: accessLogStream }));

    // Log no console se for desenvolvimento
    if (isDevelopment) {
      this.server.use(morgan("dev"));
    }

    // Log personalizado com Winston
    this.server.use((req, res, next) => {
      const start = process.hrtime();
      res.on("finish", () => {
        const { method, originalUrl } = req;
        const status = res.statusCode;
        const [seconds, nanoseconds] = process.hrtime(start);
        const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

        const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
        const message = `${method} ${originalUrl} ${status} - ${durationMs}ms`;
        logger.log(level, message);
      });
      next();
    });
  }
}

module.exports = new App().server;
