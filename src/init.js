import app from "./server.js";
import "./db";

const PORT = 5000;

const handlerListen = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🔥`);
};

app.listen(PORT, handlerListen);
