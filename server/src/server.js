require("dotenv").config();
const { createServer } = require("http");
const app = require("./app.js");
const logger = require("./middleware/logger.js");


const PORT = parseInt(process.env.PORT || "4400", 10);
if (isNaN(PORT)) {
  console.error("❌ A porta especificada não é válida.");
  process.exit(1);
}

process.on("uncaughtException", (err) => {
  logger.error(`Exceção não tratada: ${err.message}\n${err.stack}`);
  process.exit(1); // ou continue dependendo do seu caso
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Rejeição não tratada: ${reason}`);
});

const server = createServer(app);

server.listen(PORT, () => console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`));

["uncaughtException", "unhandledRejection"].forEach((event) => {
  process.on(event, (err) => {
    logger.error(`Exceção não tratada: ${err.message}\n${err.stack}`);
    logger.error(`Rejeição não tratada: ${err.message}\n${err.stack}`);

    console.error(
      `🚨 Algo deu errado!\nEvento: ${event}\nErro: ${err.stack || err}`
    );
  });
});

process.on("SIGINT", () => {
  console.log("X Encerrando o servidor...");
  server.close(() => {
    console.log(" XX Servidor encerrado com sucesso.");
    process.exit(0);
  });
});
module.exports = server;
