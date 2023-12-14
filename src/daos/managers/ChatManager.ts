import fs from "fs";

export interface UserChat {
  id: string;
  user: string;
  message: string;
}

export class ChatManager {
  private chatFilePath: string;

  constructor(chatFilePath: string) {
    this.chatFilePath = chatFilePath;
  }

  private async writeFile(products: UserChat[]): Promise<void> {
    try {
      await fs.promises.writeFile(
        this.chatFilePath,
        JSON.stringify(products, null, 2),
        "utf-8"
      );
    } catch (error) {
      throw new Error(`Error writing file: ${error}`);
    }
  }

  private async readFile(): Promise<UserChat[] | []> {
    if (fs.existsSync(this.chatFilePath)) {
      return JSON.parse(await fs.promises.readFile(this.chatFilePath, "utf-8"));
    } else {
      return [];
    }
  }

  public async getChat(): Promise<UserChat[] | []> {
    try {
      const chat = await this.readFile();
      return chat;
    } catch (error) {
      throw new Error(`Error getting chat: ${error}`);
    }
  }

  public async addMessage(message: UserChat): Promise<void> {
    try {
      const chat = await this.readFile();

      await this.writeFile([...chat, message]);
    } catch (error) {
      throw new Error(`Error adding message: ${error}`);
    }
  }

  public async deleteMessageByID(id: string): Promise<void> {
    try {
      const chat = await this.readFile();

      const newChat = chat.filter((message) => message.id !== id);

      await this.writeFile(newChat);
    } catch (error) {
      throw new Error(`Error deleting message: ${error}`);
    }
  }

  public async deleteChat(): Promise<void> {
    try {
      await this.writeFile([]);
    } catch (error) {
      throw new Error(`Error deleting chat: ${error}`);
    }
  }
}
