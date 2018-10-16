document.addEventListener("DOMContentLoaded", () => {
  listNotes();
  let btn = document.getElementById("add-btn");
  btn.addEventListener("click", () => {
    createNote();
  });
});

function listNotes() {
  fetch("http://localhost:3000/api/v1/users")
    .then(resp => resp.json())
    .then(data => {
      renderPreview(data[0].notes);
    });
}

function renderPreview(notes) {
  let container = document.getElementById("preview");
  notes.forEach(note => {
    container.innerHTML += `
    <h3 onclick="fetchNote(${note.id})" >${note.title}</h3> 
    <p>${note.body.slice(0, 50)}...</p>
    `;
  });
}

function fetchNote(id) {
  fetch(`http://localhost:3000/api/v1/notes/${id}`)
    .then(resp => resp.json())
    .then(data => {
      renderNote(data, id);
    });
}

function renderNote(note, id) {
  let container = document.getElementById("body");
  container.innerHTML = `
    <h1>${note.title}</h1>
    <p>${note.body}</p>
    <button id="edit">Edit</button>
    <button id="delete">Delete</button>
    `;
  document.getElementById("edit").addEventListener("click", event => {
    // console.log(event.target.parentNode, this);
    updateNote(event.target, id);
  });
  document.getElementById("delete").addEventListener("click", event => {
    // console.log(event.target.parentNode, this);
    deleteNote(event.target, id);
  });
}

function createNote() {
  let container = document.getElementById("body");
  container.innerHTML = `
  <form id= "add-note-form">
    Title:<br>
    <input type="text" name="title"><br>
    Content:<br>
    <textarea name="body" rows="30" cols="70" placeholder = "body"></textarea>
    <br>
    <input type="submit" value="Submit"> 
  </form>
`;
  document.getElementById("add-note-form").addEventListener("submit", event => {
    putNote(event);
  });
}

function putNote(event) {
  event.preventDefault();
  let title = event.target.title.value;
  let body = event.target.body.value;
  console.log(title);
  const data = {
    user_id: 1,
    title: title,
    body: body
  };
  fetch(`http://localhost:3000/api/v1/notes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(data)
  })
    .then(resp => resp.json())
    .then(note => {
      document.getElementById("preview").innerHTML += `
    <h3 onclick="fetchNote(${note.id})" >${note.title}</h3>
      <p>${note.body.slice(0, 50)}...</p>
    `;
      renderNote(note, id);
    });
}

function updateNote(note, id) {
  event.preventDefault();

  let title = note.parentNode.children[0].innerText;
  // debugger;
  let body = note.parentNode.children[1].innerText;

  let container = document.getElementById("body");
  container.innerHTML = `
  <form id= "add-note-form">
    Title:<br>
    <input type="text" name="title" value="${title}"><br>
    Content:<br>
    <textarea name="body" rows="30" cols="70">${body}</textarea>
    <br>
    <input type="hidden" name="id" value="${id}"> 
    <input type="submit" value="Submit"> 
  </form>
`;
  document.getElementById("add-note-form").addEventListener("submit", event => {
    console.log(event.target);
    patch(event);
    // this.location.reload(true);
  });
}

function patch(event) {
  event.preventDefault();
  let title = event.target.title.value;
  let body = event.target.body.value;
  let id = event.target.id.value;
  const data = {
    user_id: 1,
    title: title,
    body: body
  };
  fetch(`http://localhost:3000/api/v1/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(data)
  })
    .then(resp => resp.json())
    .then(note => {
      console.log(note);
      document.getElementById("preview").innerHTML += `
    <h3 onclick="fetchNote(${note.id})" >${note.title}</h3>
      <p>${note.body.slice(0, 50)}...</p>
    `;
      renderNote(note, id);
    });
}

function deleteNote(note, id) {
  console.log(id);
  fetch(`http://localhost:3000/api/v1/notes/${id}`, {
    method: "DELETE"
  });
  this.location.reload(true);
}
