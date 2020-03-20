const electron = require("electron");

delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

electron.app.on("ready", () => {
  const window = new electron.BrowserWindow({
    autoHideMenuBar: true
  });
  window.loadURL("http://localhost:3000");

  window.show();
});

electron.app.on("window-all-closed", () => {
  electron.app.exit();
});
