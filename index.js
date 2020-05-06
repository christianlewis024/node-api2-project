const express = require("express");
const postsRouter = require("./router");
const server = express();
server.get("/", (req, res) => {
  res.json({ api: "Project API is up and Running!" });
});
server.use(express.json());
server.use("/api/posts", postsRouter);

server.listen(4001, () => console.log("server is up and running! port 4001"));
