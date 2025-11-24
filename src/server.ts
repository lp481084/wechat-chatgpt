import express, { Request, Response } from "express";
import { config } from "./config.js";

export interface BotStatus {
  isLoggedIn: boolean;
  botName: string;
  qrcodeUrl: string;
  startTime: Date;
}

export class WebServer {
  private app: express.Application;
  private botStatus: BotStatus;
  private server: any;

  constructor() {
    this.app = express();
    this.botStatus = {
      isLoggedIn: false,
      botName: "",
      qrcodeUrl: "",
      startTime: new Date(),
    };
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req: Request, res: Response) => {
      res.json({
        status: "running",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    });

    // Status endpoint
    this.app.get("/status", (req: Request, res: Response) => {
      res.json(this.botStatus);
    });

    // Home page with QR code
    this.app.get("/", (req: Request, res: Response) => {
      const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WeChat ChatGPT Bot</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            background-color: #e8f4f8;
            border-radius: 5px;
        }
        .status-item {
            margin: 10px 0;
        }
        .status-label {
            font-weight: bold;
            color: #555;
        }
        .qrcode {
            text-align: center;
            margin: 20px 0;
        }
        .qrcode img {
            max-width: 300px;
            border: 2px solid #ddd;
            padding: 10px;
            background: white;
        }
        .logged-in {
            color: green;
            font-weight: bold;
        }
        .not-logged-in {
            color: orange;
            font-weight: bold;
        }
        .info {
            margin-top: 20px;
            padding: 15px;
            background-color: #fff9e6;
            border-left: 4px solid #ffc107;
            border-radius: 3px;
        }
    </style>
    <script>
        // Auto refresh every 5 seconds
        setTimeout(() => location.reload(), 5000);
    </script>
</head>
<body>
    <div class="container">
        <h1>🤖 WeChat ChatGPT Bot</h1>
        
        <div class="status">
            <div class="status-item">
                <span class="status-label">状态 (Status):</span>
                <span class="${this.botStatus.isLoggedIn ? "logged-in" : "not-logged-in"}">
                    ${this.botStatus.isLoggedIn ? "✅ 已登录 (Logged In)" : "⏳ 等待登录 (Waiting for Login)"}
                </span>
            </div>
            ${
              this.botStatus.isLoggedIn
                ? `
            <div class="status-item">
                <span class="status-label">机器人名称 (Bot Name):</span>
                <span>${this.botStatus.botName}</span>
            </div>
            `
                : ""
            }
            <div class="status-item">
                <span class="status-label">启动时间 (Start Time):</span>
                <span>${this.botStatus.startTime.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</span>
            </div>
            <div class="status-item">
                <span class="status-label">运行时长 (Uptime):</span>
                <span>${Math.floor(process.uptime())} 秒 (seconds)</span>
            </div>
        </div>

        ${
          !this.botStatus.isLoggedIn && this.botStatus.qrcodeUrl
            ? `
        <div class="qrcode">
            <h2>扫描二维码登录 (Scan QR Code to Login)</h2>
            <img src="${this.botStatus.qrcodeUrl}" alt="Login QR Code" />
            <p>请使用微信扫描上方二维码登录<br/>Please scan the QR code above with WeChat</p>
        </div>
        `
            : ""
        }

        <div class="info">
            <p><strong>💡 提示 (Tips):</strong></p>
            <ul>
                <li>页面每5秒自动刷新 (Page auto-refreshes every 5 seconds)</li>
                <li>登录后即可开始使用微信机器人 (Bot will be ready after login)</li>
                <li>访问 <code>/health</code> 查看健康状态 (Visit /health for health check)</li>
                <li>访问 <code>/status</code> 获取JSON格式状态 (Visit /status for JSON status)</li>
            </ul>
        </div>
    </div>
</body>
</html>
      `;
      res.send(html);
    });
  }

  public updateQRCode(url: string): void {
    this.botStatus.qrcodeUrl = url;
  }

  public updateLoginStatus(isLoggedIn: boolean, botName: string = ""): void {
    this.botStatus.isLoggedIn = isLoggedIn;
    this.botStatus.botName = botName;
  }

  public start(): void {
    const { webServerPort, webServerHost } = config;
    this.server = this.app.listen(webServerPort, webServerHost, () => {
      console.log(
        `🌐 Web server is running at http://${webServerHost}:${webServerPort}`
      );
      console.log(`   - Home page: http://${webServerHost}:${webServerPort}/`);
      console.log(
        `   - Health check: http://${webServerHost}:${webServerPort}/health`
      );
      console.log(
        `   - Status API: http://${webServerHost}:${webServerPort}/status`
      );
      if (webServerHost === "0.0.0.0") {
        console.log(
          `   - Access from network: http://<your-local-ip>:${webServerPort}/`
        );
      }
    });
  }

  public stop(): void {
    if (this.server) {
      this.server.close();
    }
  }
}
