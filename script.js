let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionListEl = document.getElementById('transactionList');
const form = document.querySelector('.transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const tabs = document.querySelectorAll('.tab');
const addBtn = document.getElementById('addBtn');

let activeTab = 'income';

function updateBalance() {
    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const income = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    const expense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    balanceEl.textContent = `$${total.toFixed(2)}`;
    incomeEl.textContent = `$${income.toFixed(2)}`;
    expenseEl.textContent = `$${Math.abs(expense).toFixed(2)}`;
}

function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add('transaction-item', 'fade-in');
    item.innerHTML = `
        <div class="transaction-info">
            <span class="description">${transaction.description}</span>
            <span class="amount ${transaction.amount < 0 ? 'expense' : 'income'}">
                ${sign}$${Math.abs(transaction.amount).toFixed(2)}
            </span>
        </div>
        <div class="actions">
            <button class="edit" onclick="editTransaction(${transaction.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete" onclick="removeTransaction(${transaction.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    transactionListEl.appendChild(item);
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    transactionListEl.innerHTML = '';
    transactions.forEach(addTransactionToDOM);
    updateBalance();
}

function addTransaction(e) {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = activeTab === 'income' ? +amountInput.value : -amountInput.value;

    if (description === '' || amount === 0) {
        alert('Please enter a valid description and amount');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount
    };

    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateBalance();
    updateLocalStorage();

    descriptionInput.value = '';
    amountInput.value = '';
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init();
    updateLocalStorage();
}

function editTransaction(id) {
    const transaction = transactions.find(transaction => transaction.id === id);
    if (transaction) {
        descriptionInput.value = transaction.description;
        amountInput.value = Math.abs(transaction.amount);
        removeTransaction(id);
        if (transaction.amount < 0) {
            setActiveTab('expense');
        } else {
            setActiveTab('income');
        }
    }
}

form.addEventListener('submit', addTransaction);

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        setActiveTab(tab.getAttribute('data-type'));
    });
});

function setActiveTab(type) {
    activeTab = type;
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-type="${type}"]`).classList.add('active');
    addBtn.textContent = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
}

init();
setActiveTab('income');