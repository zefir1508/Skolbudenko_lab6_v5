document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const loadDataButton = document.getElementById('loadDataButton');
    const clearButton = document.getElementById('clearButton');
    const message = document.getElementById('message');
    const confirmSection = document.getElementById('confirmSection');
    const showTableButton = document.getElementById('showTableButton');
    const hideTableButton = document.getElementById('hideTableButton');
    const tableSection = document.getElementById('tableSection');
    const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const clearSortButton = document.getElementById('clearSortButton');

    let jsonData = [];
    let originalData = [];

    loadDataButton.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (!url) {
            message.innerText = 'Будь ласка, введіть URL';
            return;
        }
        fetchData(url);
    });

    clearButton.addEventListener('click', () => {
        resetUI();
    });

    showTableButton.addEventListener('click', () => {
        renderTable(jsonData);
    });

    hideTableButton.addEventListener('click', () => {
        resetUI();
    });

    clearSortButton.addEventListener('click', () => {
        renderTable(originalData);
    });

    document.getElementById('idHeader').addEventListener('click', () => sortTable('id'));
    document.getElementById('nameHeader').addEventListener('click', () => sortTable('name'));
    document.getElementById('zipcodeHeader').addEventListener('click', () => sortTable('address.zipcode'));
    document.getElementById('cityHeader').addEventListener('click', () => sortTable('address.city'));

    function fetchData(url) {
        loadDataButton.classList.add('inactive');
        loadDataButton.classList.remove('active');
        loadDataButton.disabled = true;
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                jsonData = data;
                originalData = [...data]; // зберігаємо оригінальні дані
                message.innerText = `Дані формату JSON успішно завантажено. Кількість записів рівна ${data.length}.`;
                confirmSection.classList.remove('hidden');
                clearButton.classList.add('active');
                clearButton.classList.remove('inactive');
                clearButton.disabled = false;
            })
            .catch(error => {
                message.innerText = `Помилка: ${error.message}`;
                loadDataButton.classList.add('active');
                loadDataButton.classList.remove('inactive');
                loadDataButton.disabled = false;
            });
    }

    function renderTable(data) {
        dataTable.innerHTML = '';
        data.forEach(user => {
            const row = dataTable.insertRow();
            row.insertCell().innerText = user.id;
            row.insertCell().innerText = user.name;
            row.insertCell().innerText = user.address.zipcode;
            row.insertCell().innerText = user.address.city;
        });
        tableSection.classList.remove('hidden');
        confirmSection.classList.add('hidden');
    }

    function sortTable(property) {
        const [prop, subProp] = property.split('.');
        jsonData.sort((a, b) => {
            const aValue = subProp ? a[prop][subProp] : a[prop];
            const bValue = subProp ? b[prop][subProp] : b[prop];
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        });
        renderTable(jsonData);
    }

    function resetUI() {
        urlInput.value = '';
        message.innerText = '';
        confirmSection.classList.add('hidden');
        tableSection.classList.add('hidden');
        clearButton.classList.add('inactive');
        clearButton.classList.remove('active');
        clearButton.disabled = true;
        loadDataButton.classList.add('active');
        loadDataButton.classList.remove('inactive');
        loadDataButton.disabled = false;
    }
});
