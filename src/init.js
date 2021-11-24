import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/User";
import "./models/Board";
import "./models/List";
import "./models/Task";
import app from "./server.js";

const PORT = process.env.PORT || 4000;

const handlerListen = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🔥`);
};

app.listen(PORT, handlerListen);
