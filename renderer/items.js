let items = document.querySelector('#items');

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage));
};

exports.select = e => {
  document.querySelector('.read-item.selected').classList.remove('selected');
  e.currentTarget.classList.add('selected');
};

exports.changeSelection = direction => {
  let currentItem = document.querySelector('.read-item.selected');
  if (direction === 'ArrowUp' && currentItem.previousElementSibling) {
    currentItem.classList.remove('selected');
    currentItem.previousElementSibling.classList.add('selected');
  } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
    currentItem.classList.remove('selected');
    currentItem.nextElementSibling.classList.add('selected');
  }
};

exports.open = () => {
  if (!this.storage.length) return;

  let selectedItem = document.querySelector('.read-item.selected');
  let contentUrl = selectedItem.dataset.url;

  console.log('Opening: ', contentUrl);
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
