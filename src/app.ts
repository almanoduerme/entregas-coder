import express, { Application, Request, Response, NextFunction } from "express";
import productRouter from "./routes/products.route";

export class Server {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(this.errorHandler);
  }

  private routes() {
    this.app.use("/", productRouter);

    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({ message: "Route not found" });
    });
  }

  private errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(`Error occurred: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }

  private listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  public async start() {
    this.middlewares();
    this.routes();
    this.listen();
  }
}
