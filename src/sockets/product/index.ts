import { Server, Socket } from "socket.io";
import { Product } from "../../interfaces";
import { ProductManager } from "../../daos/managers";
import { baseDirectory } from "../../utils";

class ProductSocket {
  private io: Server;
  private productManager: ProductManager;

  constructor(io: Server) {
    this.io = io;
    this.productManager = new ProductManager(`${baseDirectory}/database/products.json`);
  }

  private async emitUpdatedProducts() {
    const products = await this.productManager.getProducts();
    this.io.emit('products', products);
  }

  public initializeSocket() {
    this.io.on('connection', async (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Initial product list emission when a new client connects
      await this.emitUpdatedProducts();

      // Receive new product from client and broadcast to all clients
      socket.on('newProduct', async (product: Product) => {
        await this.productManager.createProduct(product);
        await this.emitUpdatedProducts();
      });

      // Receive product ID to delete from client and broadcast to all clients
      socket.on('deleteProduct', async (id: string) => {
        await this.productManager.deleteProductByID(id);
        await this.emitUpdatedProducts();
      });

      // Disconnect client
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}

export { ProductSocket };
