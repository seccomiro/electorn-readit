const { ipcRenderer } = require('electron');

exports.setStatus = ids => {
  ipcRenderer.send('menu-enable', ids);
};
