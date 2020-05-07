const express = require("express");
const postsRouter = require("./router");
const server = express();

const PORT = process.env.PORT || 6001;
server.get("/", (req, res) => {
  res.json({ api: "Project API is up and Running!" });
});
server.use(express.json());
server.use("/api/posts", postsRouter);

server.listen(PORT, () => {
  console.log(`server runnong on ${PORT}`);
});
