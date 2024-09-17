import { Application } from "express";
import { connectDB } from "./config/mongodb.config";
import RabbitMQClient from "./rabbitmq/client";
import express from "express";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    RabbitMQClient.initialize();
    connectDB();
  }
}

export default App;
