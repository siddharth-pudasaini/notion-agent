import express from "express";
import routes from "./routes/routes";
import errorHandler from "./middlewares/errorHandler";
import tokenHandler from "./middlewares/tokenHandler";

const app = express();

app.use(express.json());

// Apply token handler middleware to attach Notion API key to each request
app.use(tokenHandler);

app.use("/", routes);
app.use(errorHandler);

app.listen(9000, "0.0.0.0", () => {
  console.log(`Server is running on port 9000 `);
});
