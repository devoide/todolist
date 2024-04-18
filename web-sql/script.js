document.addEventListener("DOMContentLoaded", load_content)


function load_content(){
    fetchItems()
    document.getElementById("done").addEventListener("click", doneButtonClickHandler);
}

function fetchItems() {
    fetch('http://localhost:3000/items')
        .then(response => response.json())
        .then(data => {
            const parentdiv = document.getElementById("list");
            while (parentdiv.firstChild) {
                parentdiv.removeChild(parentdiv.firstChild);
            }
            data.forEach((item) => {
                const inp = document.createElement('input');
                const lab = document.createElement('label');
                const br = document.createElement('br');
                const cancel = document.createElement('span');
                const div = document.createElement('div');
                inp.classList.add("list_item");
                inp.type = "checkbox";
                lab.innerText = item.text;
                lab.classList.add("listItem")
                cancel.classList.add("cancelbut");
                cancel.innerHTML = '  &times;   ';
                div.id = 'div-' + item.text + '-' + item.id;
                cancel.id = 'cancel-' + item.text + '-' + item.id;
                div.classList.add("item-div");
                console.log(item.checked)
                inp.checked = item.checked !== 0;
                div.appendChild(inp);
                div.appendChild(lab);
                div.appendChild(cancel);
                div.appendChild(br);
                parentdiv.appendChild(div);
                cancel.addEventListener("click", () => {
                    console.log(item.id)
                    deleter(item.id);
                });
                inp.addEventListener("change", () => {
                    changer(item.id)
                })
            });
        })
        .catch(error => console.error('Error:', error));
}
function doneButtonClickHandler() {
    let listItem = document.getElementById("inputText").value;
    if (listItem !== ''){
        document.getElementById("inputText").value = '';

        // POST the new item to the server
        fetch('http://localhost:3000/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: listItem}),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                fetchItems();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

function deleter(index) {
    fetch('http://localhost:3000/deleteItem', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: index }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Delete Success:', data);
            fetchItems(); // Refresh the items list
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function changer(index){
    fetch('http://localhost:3000/changeItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: index }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then (data => {
            console.log('Update Success:', data);
            fetchItems();
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}