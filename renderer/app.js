const { ipcRenderer } = require('electron');
const items = require('./items');

let showModal = document.querySelector('#show-modal');
let closeModal = document.querySelector('#close-modal');
let modal = document.querySelector('#modal');
let addItem = document.querySelector('#add-item');
let itemUrl = document.querySelector('#url');
let search = document.querySelector('#search');

ipcRenderer.on('menu-show-modal', () => {
  showModal.click();
});

ipcRenderer.on('menu-open-item', () => {
  items.open();
});

ipcRenderer.on('menu-delete-item', () => {
  const selectedItem = items.getSelectedItem();
  if (selectedItem.node) {
    items.delete(selectedItem.index);
  }
});

ipcRenderer.on('menu-open-item-native', () => {
  items.openNative();
});

ipcRenderer.on('menu-focus-search', () => {
  search.focus();
});

search.addEventListener('keyup', e => {
  Array.from(document.querySelectorAll('.read-item')).forEach(item => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? 'flex' : 'none';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key);
  }
});

const toggleModalButtons = () => {
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = 'Add Item';
    closeModal.style.display = 'inline';
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = 'Adding...';
    closeModal.style.display = 'none';
  }
};

showModal.addEventListener('click', e => {
  modal.style.display = 'flex';
  itemUrl.focus();
});

closeModal.addEventListener('click', e => {
  modal.style.display = 'none';
});

addItem.addEventListener('click', e => {
  if (itemUrl.value) {
    ipcRenderer.send('new-item', itemUrl.value);
    toggleModalButtons();
  }
});

ipcRenderer.on('new-item-success', (e, newItem) => {
  items.addItem(newItem, true);

  toggleModalButtons();

  modal.style.display = 'none';
  itemUrl.value = '';
});

itemUrl.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    addItem.click();
  }
});
