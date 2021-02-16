const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.autoDownload = false;

module.exports = () => {
  autoUpdater.checkForUpdates();

  autoUpdater.on('update-available', async () => {
    const updateResult = await dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message:
        'A new version of Readit is available. Do you want to update now?',
      buttons: ['Update', 'No'],
    });

    if (updateResult.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-downloaded', async () => {
    const installResult = await dialog.showMessageBox({
      type: 'info',
      title: 'Update ready',
      message: 'Your update is ready to be installed. Install & restart now?',
      buttons: ['Yes', 'Later'],
    });

    if (installResult.response === 0) {
      autoUpdater.quitAndInstall(false, true);
    }
  });
};
