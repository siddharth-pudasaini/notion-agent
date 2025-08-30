import type { event } from "./AgentOrchestrator";

type LogType = event;

export class AOSLogger {
  constructor(
    private apiKey: string,
    private baseUrl: string,
    private sessionToken: string
  ) {}

  async log(message: string, type: LogType, metadata?: Record<string, any>) {
    try {
      console.log("sending logs");
      const response = await fetch(`${this.baseUrl}/chat/agent/logs`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
          "x-session-token": this.sessionToken,
        },
        body: JSON.stringify({ message, type, metadata }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`Logging failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      console.warn("Intermediary logging failed:", error);
      // Don't throw - logging failures shouldn't break agent functionality
    }
  }

  async batch(logs: Array<{ message: string; type: LogType; metadata?: any }>) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/agent/logs/batch`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
          "x-session-token": this.sessionToken,
        },
        body: JSON.stringify({ logs }),
      });

      return await response.json();
    } catch (error) {
      console.warn("Batch logging failed:", error);
    }
  }
}
