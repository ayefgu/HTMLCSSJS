let inputBox;

window.onload = function () {
    inputBox = document.querySelector("#inputBox");
    const addBtn = document.querySelector("#addBtn");
    const savedToDos = JSON.parse(localStorage.getItem("todos"));

    if (savedToDos && savedToDos.length > 0) {
        savedToDos.forEach((todo) => createToDo(todo));
    }

    addBtn.addEventListener("click", () => createToDo());

    // Удалить всё
    document.querySelector('#deleteAllBtn').addEventListener('click', () => {
        const ulNode = document.querySelector('#todolist');
        ulNode.childNodes.forEach(li => {
            li.classList.add("fade-out");
            setTimeout(() => li.remove(), 300);
        });
        saveToDoList();
    });

    // Удалить выполненные
    document.querySelector('#deleteCheckedBtn').addEventListener('click', () => {
        const ulNode = document.querySelector('#todolist');
        ulNode.childNodes.forEach(li => {
            const span = li.querySelector('span');
            if (span.classList.contains('check')) {
                li.classList.add("fade-out");
                setTimeout(() => li.remove(), 300);
            }
        });
        saveToDoList();
    });
};

function createToDo(todo) {
    if (!todo && inputBox.value.trim() === "") return;

    const liNode = document.createElement('li');

    const checkBtn = document.createElement('button');
    checkBtn.classList.add("checkBtn");

    const todoText = document.createElement('span');
    if (todo) {
        todoText.innerText = todo.contents;
        if (todo.check) {
            todoText.classList.add('check');
            checkBtn.innerText = 'V';
        }
    } else {
        todoText.innerText = inputBox.value.trim();
        inputBox.value = "";
    }

    checkBtn.addEventListener("click", function () {
        todoText.classList.toggle('check');
        checkBtn.innerText = todoText.classList.contains('check') ? 'V' : '';
        saveToDoList();
    });

    todoText.addEventListener("dblclick", () => {
        const currentText = todoText.innerText;
        const inputEdit = document.createElement('input');
        inputEdit.type = 'text';
        inputEdit.classList.add('editInput');
        inputEdit.value = currentText;
        todoText.replaceWith(inputEdit);
        inputEdit.focus();

        inputEdit.addEventListener('blur', () => {
            if (inputEdit.value.trim() !== "") {
                todoText.innerText = inputEdit.value.trim();
            }
            inputEdit.replaceWith(todoText);
            saveToDoList();
        });

        inputEdit.addEventListener('keydown', e => {
            if (e.key === 'Enter') inputEdit.blur();
        });
    });

    const delBtn = document.createElement('button');
    delBtn.innerText = 'X';
    delBtn.classList.add("delBtn");
    delBtn.addEventListener("click", function () {
        liNode.classList.add('fade-out');
        setTimeout(() => {
            liNode.remove();
            saveToDoList();
        }, 300);
    });

    liNode.appendChild(checkBtn);
    liNode.appendChild(todoText);
    liNode.appendChild(delBtn);

    const ulNode = document.querySelector('ul');
    ulNode.appendChild(liNode);
    document.querySelector('#todolist').style.display = 'block';

    saveToDoList();
}

function saveToDoList() {
    const list = [];
    const nodes = document.querySelectorAll("#todolist li");
    nodes.forEach((node) => {
        list.push({
            contents: node.querySelector("span").innerText,
            check: node.querySelector("span").classList.contains("check"),
        });
    });

    localStorage.setItem("todos", JSON.stringify(list));
}
