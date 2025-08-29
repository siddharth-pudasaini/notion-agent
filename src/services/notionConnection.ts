import axios, { type AxiosInstance } from "axios";
import { AppError } from "../middlewares/errorHandler";

export class NotionConnection {
  private apiKey: string;
  private axiosClient: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.axiosClient = axios.create({
      baseURL: "https://api.notion.com",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  public async get(path: string) {
    try {
      const response = await this.axiosClient.get(path);
      return response.data;
    } catch (error) {
      throw new AppError("Failed to fetch data from Notion", 500);
    }
  }

  public async post(path: string, data: any) {
    try {
      const response = await this.axiosClient.post(path, data);
      return response.data;
    } catch (error) {
      throw new AppError("Failed to post data to Notion", 500);
    }
  }

  public async put(path: string, data: any) {
    try {
      const response = await this.axiosClient.put(path, data);
      return response.data;
    } catch (error) {
      throw new AppError("Failed to put data to Notion", 500);
    }
  }

  public async delete(path: string) {
    try {
      const response = await this.axiosClient.delete(path);
      return response.data;
    } catch (error) {
      throw new AppError("Failed to delete data from Notion", 500);
    }
  }

  public async patch(path: string, data: any) {
    try {
      const response = await this.axiosClient.patch(path, data);
      return response.data;
    } catch (error) {
      throw new AppError("Failed to patch data in Notion", 500);
    }
  }
}
