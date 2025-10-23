import app from "./app";
import config from "./config/config";

app.listen(config.port, () => {
    console.log(`O servidor está rodando na porta ${config.port} e está no modo de ${config.nodeEnv}.`)
})