import * as dotenv from "dotenv";
dotenv.config();
import { IConfig } from "./interface";

export const config: IConfig = {
  openai_api_key: process.env.OPENAI_API_KEY || "123456789",
  model: process.env.MODEL || "gpt-3.5-turbo",
  chatPrivateTiggerKeyword: process.env.CHAT_PRIVATE_TRIGGER_KEYWORD || "",
  chatTiggerRule: process.env.CHAT_TRIGGER_RULE || "",
  disableGroupMessage: process.env.DISABLE_GROUP_MESSAGE === "true",
  webServerPort: parseInt(process.env.WEB_SERVER_PORT || "3000", 10),
  webServerHost: process.env.WEB_SERVER_HOST || "0.0.0.0",
};
