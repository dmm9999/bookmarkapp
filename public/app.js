function initialize () {
  retrieveBookmarks();
  attachAddButton();
}

function retrieveBookmarks () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/bookmarks');
  xhr.onload = function () {
    appendBookmarks(JSON.parse(xhr.response));
  };
  xhr.send(null);
}

function clearBookmarks () {
  var element = document.querySelector('ul');
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function appendBookmarks (bookmarks) {
  var element = document.querySelector('ul');
  for (var i in bookmarks) {
    var li = document.createElement('li');
    var title = bookmarks[i].title;
    var url = bookmarks[i].url;
    li.innerHTML = '<a href="' + url + '">' + title + '</a';
    li.setAttribute('id', i);
    element.appendChild(li);
    var deleteButton = createDeleteButton(i);
    element.appendChild(deleteButton);
  }
}


function repopulateBookmarks () {
  clearBookmarks();
  retrieveBookmarks();
}

function attachAddButton () {
  var button = document.querySelector('.add');
  button.addEventListener('click', addBookmark);
}

function addBookmark (e) {
  e.preventDefault();
  var title = document.querySelector('.title').value;
  var url = document.querySelector('.url').value;
  var bookmark = {title: title, url: url};
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "http://localhost:3000/bookmarks/", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(bookmark));
  xhr.onload = function () {
    repopulateBookmarks();
    addMessage("Bookmark Added!");
  };
}

function createDeleteButton (id) {
  var button = document.createElement('input');
  button.type = "submit";
  button.className = "delete";
  button.value = "Delete";
  button.addEventListener('click', deleteBookmark.bind(null, id));
  return button;
}

function deleteBookmark (id) {
  var xhr = new XMLHttpRequest();
  var url = "/bookmarks/" + id;
  xhr.open('DELETE', url);
  xhr.send(null);
  xhr.onload = function () {
    repopulateBookmarks();
    addMessage("Bookmark Deleted!");
  };
}

function addMessage (text) {
  var body = document.querySelector('body');
  var message = document.createElement('div');
  message.innerHTML = text;
  message.className = "message";
  body.appendChild(message);
  setTimeout(removeMessage, 1000);
}

function removeMessage () {
  var message = document.querySelector('.message');
  message.parentNode.removeChild(message);
}


document.addEventListener('DOMContentLoaded', initialize);
