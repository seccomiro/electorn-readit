const { shell } = require('electron');
const fs = require('fs');

let items = document.querySelector('#items');

let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

window.addEventListener('message', e => {
  if (e.data.action === 'delete-reader-item') {
    this.delete(e.data.itemIndex);
    e.source.close();
  }
});

exports.delete = itemIndex => {
  items.removeChild(items.childNodes[itemIndex]);
  this.storage.splice(itemIndex, 1);
  this.save();

  if (this.storage.length) {
    let newSelectedIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    document
      .querySelectorAll('.read-item')
      [newSelectedIndex].classList.add('selected');
  }
};

exports.getSelectedItem = () => {
  let currentItem = document.querySelector('.read-item.selected');
  let itemIndex = 0;
  let child = currentItem;

  if (!currentItem) {
    return { node: null, index: -1 };
  }

  while ((child = child.previousElementSibling) != null) itemIndex++;

  return { node: currentItem, index: itemIndex };
};

exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage));
};

exports.select = e => {
  this.getSelectedItem().node.classList.remove('selected');
  e.currentTarget.classList.add('selected');
};

exports.changeSelection = direction => {
  let currentItemNode = this.getSelectedItem().node;
  if (direction === 'ArrowUp' && currentItemNode.previousElementSibling) {
    currentItemNode.classList.remove('selected');
    currentItemNode.previousElementSibling.classList.add('selected');
  } else if (direction === 'ArrowDown' && currentItemNode.nextElementSibling) {
    currentItemNode.classList.remove('selected');
    currentItemNode.nextElementSibling.classList.add('selected');
  }
};

exports.open = () => {
  if (!this.storage.length) return;

  let selectedItem = this.getSelectedItem();
  let contentUrl = selectedItem.node.dataset.url;

  let readerWin = window.open(
    contentUrl,
    '',
    `
  maxWidth=2000,
  mexHeight=2000,
  width=1200,
  height=800,
  backgroundColor=#dedede,
  nodeIntegration=0,
  contextIsolation=1`
  );

  readerWin.eval(readerJS.replace('`{{index}}`', selectedItem.index));
};

exports.openNative = () => {
  if (!this.storage.length) return;

  const selectedItem = this.getSelectedItem();
  const contentUrl = selectedItem.node.dataset.url;

  shell.openExternal(contentUrl);
};

exports.addItem = (item, isNew = false) => {
  let itemNode = document.createElement('div');
  itemNode.setAttribute('class', 'read-item');
  itemNode.setAttribute('data-url', item.url);
  itemNode.innerHTML = `
    <img src="${item.screenshot}" />
    <h2>${item.title}</h2>
  `;
  items.appendChild(itemNode);

  itemNode.addEventListener('click', this.select);
  itemNode.addEventListener('dblclick', this.open);
  if (document.querySelectorAll('.read-item').length === 1) {
    itemNode.classList.add('selected');
  }

  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

this.storage.forEach(item => {
  this.addItem(item);
});
