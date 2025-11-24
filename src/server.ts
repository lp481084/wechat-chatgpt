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
        // Auto refresh status every 5 seconds using fetch
        async function updateStatus() {
            try {
                const response = await fetch('/status');
                const data = await response.json();
                
                // Update login status
                const statusSpan = document.getElementById('login-status');
                if (data.isLoggedIn) {
                    statusSpan.innerHTML = '✅ 已登录 (Logged In)';
                    statusSpan.className = 'logged-in';
                } else {
                    statusSpan.innerHTML = '⏳ 等待登录 (Waiting for Login)';
                    statusSpan.className = 'not-logged-in';
                }
                
                // Update bot name
                const botNameDiv = document.getElementById('bot-name');
                if (data.isLoggedIn && data.botName) {
                    botNameDiv.style.display = 'block';
                    document.getElementById('bot-name-value').textContent = data.botName;
                } else {
                    botNameDiv.style.display = 'none';
                }
                
                // Update QR code
                const qrcodeDiv = document.getElementById('qrcode-section');
                if (!data.isLoggedIn && data.qrcodeUrl) {
                    qrcodeDiv.style.display = 'block';
                    document.getElementById('qrcode-img').src = data.qrcodeUrl;
                } else {
                    qrcodeDiv.style.display = 'none';
                }
                
                // Update start time and uptime
                const startTime = new Date(data.startTime);
                document.getElementById('start-time').textContent = startTime.toLocaleString();
                
                const uptimeSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
                document.getElementById('uptime').textContent = uptimeSeconds + ' 秒 (seconds)';
                
            } catch (error) {
                console.error('Failed to update status:', error);
            }
        }
        
        // Update status on page load
        window.addEventListener('DOMContentLoaded', updateStatus);
        
        // Update status every 5 seconds
        setInterval(updateStatus, 5000);
    </script>
</head>
<body>
    <div class="container">
        <h1>🤖 WeChat ChatGPT Bot</h1>
        
        <div class="status">
            <div class="status-item">
                <span class="status-label">状态 (Status):</span>
                <span id="login-status" class="not-logged-in">⏳ 加载中... (Loading...)</span>
            </div>
            <div id="bot-name" class="status-item" style="display: none;">
                <span class="status-label">机器人名称 (Bot Name):</span>
                <span id="bot-name-value"></span>
            </div>
            <div class="status-item">
                <span class="status-label">启动时间 (Start Time):</span>
                <span id="start-time">加载中... (Loading...)</span>
            </div>
            <div class="status-item">
                <span class="status-label">运行时长 (Uptime):</span>
                <span id="uptime">加载中... (Loading...)</span>
            </div>
        </div>

        <div id="qrcode-section" class="qrcode" style="display: none;">
            <h2>扫描二维码登录 (Scan QR Code to Login)</h2>
            <img id="qrcode-img" src="" alt="Login QR Code" />
            <p>请使用微信扫描上方二维码登录<br/>Please scan the QR code above with WeChat</p>
        </div>

        <div class="info">
            <p><strong>💡 提示 (Tips):</strong></p>
            <ul>
                <li>页面每5秒自动刷新状态 (Status auto-updates every 5 seconds)</li>
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
    try {
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

      // Attach error handler to the server instance
      this.server.on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          console.error(
            `❌ Port ${webServerPort} is already in use. Please change WEB_SERVER_PORT in .env file.`
          );
        } else {
          console.error(`❌ Web server error: ${error.message}`);
        }
      });
    } catch (error) {
      console.error(`❌ Failed to start web server: ${error}`);
    }
  }

  public stop(): void {
    if (this.server) {
      this.server.close();
    }
  }
}
