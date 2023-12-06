import { Request, Response, Router } from "express";
import { Message as MessageModelMongoDB } from "../daos/models/messages.model";
import { ChatSocket } from "../sockets/chat/index";

const webSocketRouter = Router();

webSocketRouter.get("/", (req: Request, res: Response) => {
  res.render("chat", { layout: "main" });
});

export default webSocketRouter;
