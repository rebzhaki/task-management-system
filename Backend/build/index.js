"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const express = require("express");
const app = express();
const startServer = () => {
    const server = app.listen(config_1.config.PORT, () => {
        console.log(`Server is running on: http://localhost:${config_1.config.PORT}/v1/api `);
    });
    return server;
};
startServer();
