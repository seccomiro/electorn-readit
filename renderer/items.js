let items = document.querySelector('#items');

exports.addItem = item => {
  let itemNode = document.createElement('div');
  itemNode.setAttribute('class', 'read-item');
  itemNode.innerHTML = `
    <img src="${item.screenshot}" />
    <h2>${item.title}</h2>
  `;
  items.appendChild(itemNode);
};
