const url = require("url");
const path = require("path");
const { ConnectionBuilder } = require("electron-cgi");

import { app, BrowserWindow } from "electron";

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 800,
    height: 600
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  window.webContents.openDevTools();

  window.on("closed", () => {
    window = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});

// C# Connection
let connection = new ConnectionBuilder()
    .connectTo("dotnet", "run", "--project", "./Core")
    .build();

connection.onDisconnect = () => {
  console.log("Lost connection to the .Net process...");
};

connection.send("greeting", "Mom from C#", (error: any, response: any) => {
  if (error)
  {
    console.log(error);
    return;
  }

  window.webContents.send("greeting", response);
  connection.close();
});
