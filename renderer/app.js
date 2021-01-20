const { ipcRenderer, TouchBarOtherItemsProxy } = require('electron');
const items = require('./items')

let showModal = document.querySelector('#show-modal');
let closeModal = document.querySelector('#close-modal');
let modal = document.querySelector('#modal');
let addItem = document.querySelector('#add-item');
let itemUrl = document.querySelector('#url');

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
