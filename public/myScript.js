// Function to handle the click event on the parent element encompassing all tasks
function handleTaskClick(event) {
  var target = event.target;

  // Vérifier si l'élément cliqué est le bouton de fermeture
  if (target.classList.contains('close')) {
    var div = target.parentElement;
    div.style.display = "none";

    // Supprimer l'élément de la liste depuis la base de données
    var todoId = div.getAttribute('data-todo-id');
    fetch(`/todos/${todoId}`, {
      method: 'DELETE'
    })
      .catch(error => console.error('Erreur :', error));
  }

  // Vérifier si l'élément cliqué est le bouton de check
  if (target.classList.contains('check')) {
    var listItem = target.parentElement;
    listItem.classList.toggle('checked');
    listItem.style.textDecoration = listItem.classList.contains('checked') ? 'line-through' : 'none';

    // Mettre à jour le statut "checked" de l'élément de liste dans la base de données
    var todoId = listItem.getAttribute('data-todo-id');
    fetch(`/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: listItem.classList.contains('checked') })
    })
      .catch(error => console.error('Erreur :', error));
  }
}

// Attacher l'écouteur d'événement clic à l'élément parent des tâches
var taskContainer = document.getElementById('myUL');
taskContainer.addEventListener('click', handleTaskClick);

// Function to fetch tasks from the server and update the UI
function loadTasks() {
  fetch('/todos')
    .then(response => response.json())
    .then(todos => {
      const ul = document.getElementById("myUL");

      // Supprimer les tâches existantes
      while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }

      // Ajouter les tâches à l'interface utilisateur
      todos.forEach(todo => {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(todo.title));
        li.setAttribute('data-todo-id', todo._id);

        if (todo.completed) {
          li.classList.add('checked');
          li.style.textDecoration = 'line-through';
        }

        var spanClose = document.createElement("SPAN");
        var txtClose = document.createTextNode("\u00D7");
        spanClose.className = "close";
        spanClose.appendChild(txtClose);
        li.appendChild(spanClose);

        // Ajouter un bouton de check pour l'élément de liste
        var spanCheck = document.createElement("SPAN");
        var txtCheck = document.createTextNode("\u2713");
        spanCheck.className = "check";
        spanCheck.appendChild(txtCheck);
        li.appendChild(spanCheck);

        ul.appendChild(li);
      });
    })
    .catch(error => console.error('Erreur :', error));
}

// Appeler la fonction loadTasks lors du chargement de la page
window.addEventListener('DOMContentLoaded', loadTasks);

// Créer un nouvel élément de liste lorsqu'on clique sur le bouton "Add"
function newElement() {
  // Créer un nouvel élément de liste
  var li = document.createElement("li");
  // Récupérer la valeur saisie par l'utilisateur dans l'input
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  // Vérifier si l'utilisateur a saisi quelque chose dans l'input
  if (inputValue === '') {
    alert("Vous devez écrire quelque chose !");
  } else {
    fetch('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: inputValue })
    })
      .then(response => response.json())
      .then(todo => {
        // Ajouter le todo créé à la liste
        document.getElementById("myUL").appendChild(li);
        // Sauvegarder l'ID du todo en tant qu'attribut de données sur l'élément de liste
        li.setAttribute('data-todo-id', todo._id);
        // Traiter la réponse ou mettre à jour l'interface utilisateur si nécessaire
        console.log('Nouveau todo :', todo);
      })
      .catch(error => console.error('Erreur :', error));
  }
     
  // Réinitialiser la valeur de l'input
  document.getElementById("myInput").value = "";

  // Créer un bouton de fermeture pour l'élément de liste
  var spanClose = document.createElement("SPAN");
  var txtClose = document.createTextNode("\u00D7");
  spanClose.className = "close";
  spanClose.appendChild(txtClose);
  li.appendChild(spanClose);

  // Créer un bouton de check pour l'élément de liste
  var spanCheck = document.createElement("SPAN");
  var txtCheck = document.createTextNode("\u2713");
  spanCheck.className = "check";
  spanCheck.appendChild(txtCheck);
  li.appendChild(spanCheck);
}

function displayTasks() {
  var displayOption = document.getElementById("display").value;
  var taskList = document.getElementsByTagName("ul")[0].getElementsByTagName("li");

  for (var i = 0; i < taskList.length; i++) {
    var task = taskList[i];
    if (displayOption === "checked" && !task.classList.contains("checked")) {
      task.style.display = "none";
    } else if (displayOption === "unchecked" && task.classList.contains("checked")) {
      task.style.display = "none";
    } else {
      task.style.display = "block";
    }
  }
}

document.getElementById("display").onchange = displayTasks;
