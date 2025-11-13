import app from "./app";
import config from "./config/config";

app.listen(config.port, () => {
    console.log(`The server is running at ${config.port} port and it's in the ${config.nodeEnv} mode.`)
})