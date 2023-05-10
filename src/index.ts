import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";

//routes
import auth from "./routes/auth";
import profile from "./routes/profile";
import changelog from "./routes/changelog";
import project from './routes/project'

const port = process.env.PORT || 5000;
const main = async () => {
  const app = express();

  morgan.token("body", (req: express.Request) => JSON.stringify(req.body));
  // app.use(helmet());
  app.use(
    morgan(
      ":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
    )
  );
  app.use(express.json());
  app.use("/v1", auth);
  app.use("/v1/profile", profile);
  app.use('/v1/changelog', changelog);
  app.use('/v1/project', project)

  app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
  });
};

main();
