const dotenv = require("dotenv");

dotenv.config();

const REQUIRED_ENV_VARS = ["DATABASE_URL", "JWT_SECRET"];

function validateEnv() {
    const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        console.error(` Erro: As seguintes variáveis de ambiente estão ausentes: ${missingVars.join(", ")}`);
        process.exit(1);
    }

    console.log("Ambiente validado com sucesso!");
}

validateEnv();
module.exports = validateEnv;