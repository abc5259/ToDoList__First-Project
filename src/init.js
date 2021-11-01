import "./db";
import "./models/User";
import "./models/Board";
import "./models/Card";
import "./models/Task";
import app from "./server.js";

const PORT = 5000;

const handlerListen = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🔥`);
};

app.listen(PORT, handlerListen);
