import { Request, Response, Router } from "express";
const webSocketRouter = Router();

webSocketRouter.get("/", (req: Request, res: Response) => {
  res.render("chat", { layout: "main" });
});

export default webSocketRouter;
