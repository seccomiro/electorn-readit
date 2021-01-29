const { Menu, shell, ipcMain } = require('electron');

let mainWindow, mainMenu;

module.exports = appWin => {
  mainWindow = appWin;
  let template = [
    {
      id: 'items',
      label: 'Items',
      submenu: [
        {
          id: 'add-new',
          label: 'Add New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            appWin.webContents.send('menu-show-modal');
          },
        },
        {
          id: 'read-item',
          label: 'Read Item',
          accelerator: 'CmdOrCtrl+Enter',
          click: () => {
            appWin.webContents.send('menu-open-item');
          },
        },
        {
          id: 'delete-item',
          label: 'Delete Item',
          accelerator: 'CmdOrCtrl+Backspace',
          click: () => {
            appWin.webContents.send('menu-delete-item');
          },
        },
        {
          id: 'open-native',
          label: 'Open in Browser',
          accelerator: 'CmdOrCtrl+Shift+Enter',
          click: () => {
            appWin.webContents.send('menu-open-item-native');
          },
        },
        {
          id: 'search',
          label: 'Search',
          accelerator: 'CmdOrCtrl+F',
          enabled: false,
          click: () => {
            appWin.webContents.send('menu-focus-search');
          },
        },
      ],
    },
    {
      role: 'editMenu',
    },
    {
      role: 'windowMenu',
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn more',
          click: () => {
            shell.openExternal('http://github.com/seccomiro/electron-readit');
          },
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      role: 'appMenu',
    });
  }

  const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
  mainMenu = menu;
  appWin.setMenu(menu);
};

const enableMenu = (id, enable) => {
  const menuItem = mainMenu.getMenuItemById(id);
  if (menuItem) {
    menuItem.enabled = enable === true;
  }
};

ipcMain.on('menu-enable', (e, ids = {}) => {
  ids.enable?.forEach(id => enableMenu(id, true));
  ids.disable?.forEach(id => enableMenu(id, false));
});
