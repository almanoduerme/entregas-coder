import express, { Application, Request, Response, NextFunction } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { engine } from "express-handlebars";
import { cartRoute, productsRoute, webSocketRoute } from "./routes";
import { baseDirectory } from "./utils";
import { ChatSocket, ProductSocket } from "./sockets";

import dotenv from "dotenv";

import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

dotenv.config();

// Mongoose connection
import { MongooseConnection } from "./databases/mongodb";
const keyMongoDB: string = process.env.MONGO_URL || "";

export class Server {
  private app: Application;
  private port: number;

  private server: HttpServer;
  private io: SocketServer;

  private productSocket: ProductSocket;
  private chatSocket: ChatSocket;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.server = createServer(this.app);
    this.io = new SocketServer(this.server);

    this.productSocket = new ProductSocket(this.io);
    this.chatSocket = new ChatSocket(this.io);

    // Handlebars
    this.app.engine("handlebars", engine({ handlebars: allowInsecurePrototypeAccess(require("handlebars"))}));
    this.app.set("view engine", "handlebars");
    this.app.set("views", `${baseDirectory}/views`);

    // Static files
    this.app.use(express.static("public"));
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(this.errorHandler);
  }

  private connectToDatabase(): void {
    const mongoConnection = new MongooseConnection(keyMongoDB);
    mongoConnection.connect();
  }

  private routes() {
    this.app.use("/products", productsRoute);
    this.app.use("/api/carts", cartRoute);
    this.app.use("/chat", webSocketRoute);

    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({ message: "Route not found" });
    });
  }

  private sockets(): void {
    this.productSocket.initializeSocket();
    this.chatSocket.initializeSocket();
  }

  private errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof SyntaxError) {
      res.status(400).json({ error: "Invalid JSON" });
    } else {
      console.error(`Error occurred: ${err.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }

    next();
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`App listening on http://localhost:${this.port}`);
    });
  }

  public start(): void {
    this.sockets();
    this.middlewares();
    this.connectToDatabase();
    this.routes();
    this.listen();
  }
}
