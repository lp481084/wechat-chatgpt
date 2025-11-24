<h1 align="center">欢迎使用 wechat-chatgpt 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
  <a href="https://twitter.com/fuergaosi" target="_blank">
    <img alt="Twitter: fuergaosi" src="https://img.shields.io/twitter/follow/fuergaosi.svg?style=social" />
  </a>
  <a href="https://discord.gg/8fXNrxwUJH" target="blank">
    <img src="https://img.shields.io/discord/1058994816446369832?label=Join%20Community&logo=discord&style=flat-square" alt="join discord community of github profile readme generator"/>
  </a>
</p>

> 在微信上迅速接入 ChatGPT，让它成为你最好的助手！  
> [English](README.md) | 中文文档

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/dMLG70?referralCode=bIYugQ)

## 🌟 功能点

- [x] 通过 [wechaty](https://github.com/wechaty/wechaty) 和 [官方 API](https://openai.com/blog/introducing-chatgpt-and-whisper-apis)，将 ChatGPT 接入微信
- [x] 加入了持续对话的功能
- [x] 加入 Dockerfile, 通过 [Docker](#通过docker使用-推荐) 进行部署
- [x] 发布到 Docker.hub
- [x] 使用[docker compose](#通过docker-compose使用-推荐)进行部署
- [x] 通过 Railway 进行部署

## 🚀 使用
- [在 Railway 部署](#使用railway进行部署)(PaaS, 免费, 稳定, ✅推荐)
- [在 Fly.io 部署](#通过flyio进行部署)(PaaS, 免费, ✅推荐)
- [使用 Docker 部署](#通过docker使用)(自托管, 稳定, ✅推荐)
- [使用 Docker Compose 部署](#通过docker-compose使用)(自托管, 稳定, ✅推荐)
- [使用 NodeJS 部署](#使用nodejs运行)

## 使用Railway进行部署
> Railway 是一个免费的 PaaS 平台，5刀以内的账单免费或者每个月500小时的运行时间
1. 点击 [Railway](https://railway.app/template/dMLG70?referralCode=bIYugQ) 按钮，进入 Railway 部署页面
2. 点击 `Deploy Now` 按钮，进入 Railway 部署页面
3. 填写 仓库名称和 `OPENAI_API_KEY`(需要连接 GitHub 账号)
4. 点击 `Deploy` 按钮
5. 点击 `View Logs` 按钮，等待部署完成

## 通过Fly.io进行部署
> 请为应用程序分配 512 MB 内存，否则可能会出现内存溢出

> Fly.io 5刀以内的账单免费(免费计划的3个256MB的应用不在账单内)也就是可以同时可以部署 `1*512MB + 3*256MB` 
1. 安装 [flyctl](https://fly.io/docs/getting-started/installing-flyctl/)
   ```shell
    # macOS
    brew install flyctl
    # Windows
    scoop install flyctl
    # Linux
    curl https://fly.io/install.sh | sh
   ```
2. 克隆项目并进入项目目录
   ```shell
   git clone https://github.com/fuergaosi233/wechat-chatgpt.git && cd wechat-chatgpt
   ```
3. 创建应用
   ```shell
   ➜ flyctl launch 
    ? Would you like to copy its configuration to the new app? No
    ? App Name (leave blank to use an auto-generated name): <YOUR APP NAME>
    ? Select region: <YOUR CHOOSE REGION>
    ? Would you like to setup a Postgresql database now? No
    ? Would you like to deploy now? No
   ```
4. 配置环境变量
   ```shell
   flyctl secrets set OPENAI_API_KEY="<YOUR OPENAI API KEY>" MODEL="<CHATGPT-MODEL>"
   ```
5. 部署应用
   ```shell
   flyctl deploy
   ```

## 通过Docker使用

```sh
# 拉取镜像
docker pull holegots/wechat-chatgpt:latest
# 运行容器
docker run -it --name wechat-chatgpt \
    -p 3000:3000 \
    -e OPENAI_API_KEY=<YOUR OPENAI API KEY> \
    -e MODEL="gpt-3.5-turbo" \
    -e CHAT_PRIVATE_TRIGGER_KEYWORD="" \
    -v $(pwd)/data:/app/data/wechat-assistant.memory-card.json \
    holegots/wechat-chatgpt:latest
# 使用二维码登陆（通过日志或Web界面）
docker logs -f wechat-chatgpt
# 或者在浏览器中访问 http://localhost:3000
```
> 如何获取 OPENAI API KEY？请参考 [OpenAI API](https://platform.openai.com/account/api-keys)。

## 通过docker compose使用

```sh
# 根据模板拷贝配置文件
cp .env.example .env
# 使用你喜欢的文本编辑器修改配置文件
vim .env
# 在Linux或WindowsPowerShell上运行如下命令
docker compose up -d
# 使用二维码登陆
docker logs -f wechat-chatgpt
```

**提示：** 启动容器后，Web界面将在 `http://localhost:3000` 可用。您也可以直接在浏览器中扫描二维码。

## 使用NodeJS运行
> 请确认安装的NodeJS版本为18.0.0以上
```sh
# 克隆项目
git clone https://github.com/fuergaosi233/wechat-chatgpt.git && cd wechat-chatgpt
# 安装依赖
npm install
# 编辑配置
cp .env.example .env
vim .env # 使用你喜欢的文本编辑器修改配置文件
# 启动项目
npm run dev
# 如果您是初次登陆，那么需要扫描二维码
```
> 请确保您的账号可以登陆 [网页版微信](https://wx.qq.com/)。


## 🌐 Web界面 - 本地IP地址访问

机器人现在包含了一个内置的Web服务器，您可以：
- 在浏览器中查看机器人状态和登录状态
- 在浏览器中查看二维码，更方便地登录
- 监控机器人的健康状态和运行时间
- 从局域网内的任何设备访问

### 配置说明

在 `.env` 文件中设置以下环境变量：

```sh
WEB_SERVER_PORT=3000        # Web服务器端口（默认：3000）
WEB_SERVER_HOST=0.0.0.0     # 主机绑定地址（0.0.0.0 允许局域网访问）
```

### 访问Web界面

启动机器人后，在浏览器中打开：
- 本地访问：`http://localhost:3000`
- 局域网访问：`http://<你的本地IP>:3000`（例如：`http://192.168.1.100:3000`）

### 可用的接口

- `/` - 主页，显示二维码和状态信息
- `/health` - 健康检查接口（JSON格式）
- `/status` - 机器人状态API（JSON格式）

**如何获取本地IP地址？**
- Windows: 在命令提示符中运行 `ipconfig`，查找 "IPv4 地址"
- macOS/Linux: 在终端中运行 `ifconfig` 或 `ip addr`，查找您的网络接口IP
- 示例：如果您的IP是 `192.168.1.100`，则访问 `http://192.168.1.100:3000`


## ✨ Contributor

<a href="https://github.com/fuergaosi233/wechat-chatgpt/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fuergaosi233/wechat-chatgpt" />
</a>

## 🤝 为项目添砖加瓦

欢迎提出 Contributions, issues 与 feature requests!<br />随时查看 [issues page](https://github.com/fuergaosi233/wechat-chatgpt/issues).

## 感谢支持 🙏

如果这个项目对你产生了一点的帮助，请为这个项目点上一颗 ⭐️