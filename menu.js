const { Menu, shell } = require('electron');

module.exports = appWin => {
  let template = [
    {
      label: 'Items',
      submenu: [
        {
          label: 'Add New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            appWin.send('menu-show-modal');
          },
        },
        {
          label: 'Read Item',
          accelerator: 'CmdOrCtrl+Enter',
          click: () => {
            appWin.send('menu-open-item');
          },
        },
        {
          label: 'Delete Item',
          accelerator: 'CmdOrCtrl+Backspace',
          click: () => {
            appWin.send('menu-delete-item');
          },
        },
        {
          label: 'Open in Browser',
          accelerator: 'CmdOrCtrl+Shift+Enter',
          click: () => {
            appWin.send('menu-open-item-native');
          },
        },
        {
          label: 'Search',
          accelerator: 'CmdOrCtrl+F',
          enabled: false,
          click: () => {
            appWin.send('menu-focus-search');
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
  Menu.setApplicationMenu(menu);
};
