import config from "./local.config"
import { IConfig } from "./IConfig";

export default class Config {
  static getConfig(): IConfig {
    return config;
  }
}