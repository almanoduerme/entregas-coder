import { Request, Response, Router } from "express";

const webSocketRoute = Router();

webSocketRoute.get("/realtimeproducts", (req: Request, res: Response) => {
  res.render("realtimeproducts"); 
});

export default webSocketRoute;
