document.addEventListener("DOMContentLoaded", load_content)

function load_content(){
    fetchItems()
    document.getElementById("done").addEventListener("click", doneButtonClickHandler);
    document.getElementById("inputText").focus();
    document.getElementById("deleteBtn").addEventListener("click", deleteAll)
}

function fetchItems() {
    const parentdiv = document.getElementById("list");
    while (parentdiv.firstChild) {
        parentdiv.removeChild(parentdiv.firstChild);
    }
    if (localStorage.getItem('todoItems')) {
        const items = JSON.parse(localStorage.getItem('todoItems'))
        items.reverse();
        items.forEach(item => {
            const inp = document.createElement('input');
            const lab = document.createElement('label');
            const br = document.createElement('br');
            const cancel = document.createElement('span');
            const div = document.createElement('div');
            inp.classList.add("list_item");
            inp.type = "checkbox";
            lab.innerText = item.content;
            lab.classList.add("listItem")
            cancel.classList.add("cancelbut");
            cancel.innerHTML = '  &times;   ';
            div.id = 'div-' + item.id;
            cancel.id = 'cancel-' + item.id;
            div.classList.add("item-div");
            //console.log(item.checked)
            inp.checked = item.completed !== 0;
            div.appendChild(inp);
            div.appendChild(lab);
            div.appendChild(cancel);
            div.appendChild(br);
            parentdiv.appendChild(div);
            cancel.addEventListener("click", () => {
                deleter(item.id);
            });
            inp.addEventListener("change", () => {
                changer(item.id)
            });
        });
        items.reverse();

    }
}

function doneButtonClickHandler() {
    let listItem = document.getElementById("inputText").value;
    console.log(listItem === '')
    if (listItem !== '') {
        const storedArrayJSON = localStorage.getItem('todoItems');
        const storedArray = storedArrayJSON ? JSON.parse(storedArrayJSON) : [];
        const new_value = {id: Date.now().toString(), content: listItem, completed: 0}
        storedArray.push(new_value)
        localStorage.setItem('todoItems', JSON.stringify(storedArray))
        fetchItems()
    }
}

function deleter(id) {
    const items = JSON.parse(localStorage.getItem('todoItems'));
    const arrayIndex = items.findIndex(items => items.id === id);
    if (arrayIndex !== -1) {
        items.splice(arrayIndex, 1);
        localStorage.setItem('todoItems', JSON.stringify(items));
        fetchItems();
    } else {
        console.log('Item not found with id:', id);
    }
}

function changer(id) {
    const items = JSON.parse(localStorage.getItem('todoItems'));
    const arrayIndex = items.findIndex(items => items.id === id);
    if (arrayIndex !== -1) {
        items[arrayIndex].completed = 1 - items[arrayIndex].completed
        localStorage.setItem('todoItems', JSON.stringify(items));
        fetchItems();
    } else {
        console.log('Item not found with id:', id);
    }
}

function deleteAll() {
    if (localStorage.getItem('todoItems')) {
        localStorage.removeItem('todoItems');
        fetchItems();
    }
}