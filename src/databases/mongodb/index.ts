import mongoose, { Connection, Mongoose, connection } from 'mongoose'

class MongooseConnection {
  private client: Mongoose;
  private db: Connection;
  private uri: string;

  constructor(uri: string) {
    this.client = mongoose;
    this.db = connection;
    this.uri = uri;
  }

  public async connect() {
    try {
      await mongoose.connect(this.uri);
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
    }
  }

  public getDB() {
    return this.db;
  }
}

export { MongooseConnection }
