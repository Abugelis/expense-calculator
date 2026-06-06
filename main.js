let type = document.getElementById("type");
let amount = document.getElementById("amount");
let category = document.getElementById("category");
let description = document.getElementById("description");
let addTransBtn = document.getElementById("add-trans-btn")
let displayTrans = document.getElementById("display");
const amountError = document.getElementById("amount-error");
const descriptionError = document.getElementById("description-error");

let transactions = [];
let editingId = null;

addTransBtn.addEventListener("click", addTransaction);

// Create transaction object
function createTransaction() {

    return {
        id: crypto.randomUUID(),
        type: type.value,
        amount: Number(amount.value),
        category: category.value,
        description: description.value,
        date: new Date().toISOString() 
    };
}

// Save to local storage
function saveToStorage(){
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Load from local storage
function loadFromStorage(){
    const saved = localStorage.getItem("transactions");
    transactions = saved ? JSON.parse(saved) : [];
}

// Add transaction to the transactions array 
function addTransaction() {

    amountError.textContent = "";
    descriptionError.textContent = "";
    amount.classList.remove("input-error");
    description.classList.remove("input-error");

    // Create error dictionary 
    let errors = {};

    // Run validation on inputs
    if (!type.value) errors.type = "Select type";
    if (!category.value) errors.category = "Select category";

    if (amount.value <= 0 || isNaN(amount.value)) {
        errors.amount = "Enter valid amount";
        amount.classList.add("input-error");
    }

    if (!description.value.trim()) {
        errors.description = "Add description";
        description.classList.add("input-error");
    }

    if (Object.keys(errors).length > 0) {
        amountError.textContent = errors.amount || "";
        descriptionError.textContent = errors.description || "";
        return;
    }

    const transaction = createTransaction();

    transactions.push(transaction);

    // Reset form after transition is added
    document.getElementById("transaction-form").reset();

    saveToStorage();
    displayTransactions();
}

// Delete transaction from array
function deleteTransaction(id) {

    transactions = transactions.filter((transaction)=> transaction.id !== id);

    saveToStorage();
    displayTransactions();
}

// Display transactions
function displayTransactions() {
    displayTrans.innerHTML = "";

    transactions.forEach(transaction => {
        const isEditing = editingId === transaction.id;

        const card = isEditing
            ? createEditCard(transaction)
            : createViewCard(transaction);

        displayTrans.appendChild(card);
    });
}

function createViewCard(transaction) {
    const card = document.createElement("div");
    card.classList.add("transaction-card");

    const header = document.createElement("div");
    header.classList.add("card-header");

    const title = document.createElement("h3");
    title.textContent = transaction.type;

    const buttons = document.createElement("div");
    buttons.classList.add("card-header-buttons");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-icon");
    editBtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-icon");
    deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 5H14C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5ZM8.5 5C8.5 3.067 10.067 1.5 12 1.5C13.933 1.5 15.5 3.067 15.5 5H21.25C21.6642 5 22 5.33579 22 5.75C22 6.16421 21.6642 6.5 21.25 6.5H19.9309L18.7589 18.6112C18.5729 20.5334 16.9575 22 15.0263 22H8.97369C7.04254 22 5.42715 20.5334 5.24113 18.6112L4.06908 6.5H2.75C2.33579 6.5 2 6.16421 2 5.75C2 5.33579 2.33579 5 2.75 5H8.5ZM10.5 9.75C10.5 9.33579 10.1642 9 9.75 9C9.33579 9 9 9.33579 9 9.75V17.25C9 17.6642 9.33579 18 9.75 18C10.1642 18 10.5 17.6642 10.5 17.25V9.75ZM14.25 9C14.6642 9 15 9.33579 15 9.75V17.25C15 17.6642 14.6642 18 14.25 18C13.8358 18 13.5 17.6642 13.5 17.25V9.75C13.5 9.33579 13.8358 9 14.25 9ZM6.73416 18.4667C6.84577 19.62 7.815 20.5 8.97369 20.5H15.0263C16.185 20.5 17.1542 19.62 17.2658 18.4667L18.4239 6.5H5.57608L6.73416 18.4667Z" fill="currentColor"/></svg>`

    editBtn.addEventListener("click", () => {
        editingId = transaction.id;
        displayTransactions();
    });

    deleteBtn.addEventListener("click", () => {
        deleteTransaction(transaction.id);
    });

    const body = document.createElement("div");
    body.classList.add("card-body");

    const innerBody = document.createElement("div");
    innerBody.classList.add("card-inner-body");

    const category = document.createElement("p");
    category.textContent = transaction.category;

    const amount = document.createElement("p");
    amount.textContent = `€${transaction.amount}`;

    const description = document.createElement("p");
    description.textContent = transaction.description;

    const date = document.createElement("p");
    date.classList.add("time-stamp")
    date.textContent = new Date(transaction.date).toLocaleDateString();

    // Assemble
    buttons.append(editBtn, deleteBtn);
    header.append(title, buttons);
    body.append(innerBody, description, date);
    innerBody.append(category, amount);
    card.append(header, body);

    return card;
}

function createEditCard(transaction) {
    const card = document.createElement("div");
    card.classList.add("transaction-card");

    const header = document.createElement("div");
    header.classList.add("card-header");

    const title = document.createElement("h3");
    title.textContent = `Editing ${transaction.type}`;

    const body = document.createElement("div");
    body.classList.add("card-body");

    const buttons = document.createElement("div");
    buttons.classList.add("card-header-buttons");

    // Inputs
    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.value = transaction.amount;

    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.value = transaction.description;

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.classList.add("save-icon");
    saveBtn.innerHTML = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M14.414 3.207L12.793 1.586C12.421 1.213 11.905 1 11.379 1H3C1.897 1 1 1.897 1 3V13C1 14.103 1.897 15 3 15H13C14.103 15 15 14.103 15 13V4.621C15 4.095 14.787 3.579 14.414 3.207ZM9 2V3.5C9 3.776 8.776 4 8.5 4H6.5C6.224 4 6 3.776 6 3.5V2H9ZM5 14V9.5C5 9.224 5.224 9 5.5 9H10.5C10.776 9 11 9.224 11 9.5V14H5ZM14 13C14 13.551 13.551 14 13 14H12V9.5C12 8.673 11.327 8 10.5 8H5.5C4.673 8 4 8.673 4 9.5V14H3C2.449 14 2 13.551 2 13V3C2 2.449 2.449 2 3 2H5V3.5C5 4.327 5.673 5 6.5 5H8.5C9.327 5 10 4.327 10 3.5V2H11.379C11.642 2 11.9 2.107 12.086 2.293L13.707 3.914C13.893 4.1 14 4.358 14 4.621V13Z"/></svg>`

    saveBtn.addEventListener("click", () => {
        transaction.amount = Number(amountInput.value);
        transaction.description = descInput.value;

        editingId = null;

        saveToStorage();
        displayTransactions();
    });

    // Cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-icon");
    cancelBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M18.364 5.636l-12.728 12.728" /></svg>`

    cancelBtn.addEventListener("click", () => {
        editingId = null;
        displayTransactions();
    });

    body.append(amountInput, descInput);
    buttons.append(saveBtn, cancelBtn);

    header.append(title, buttons);

    card.append(header, body);

    return card;
}

// Live input error checker
amount.addEventListener("input", ()=> {
    amountError.textContent = "";
    amount.classList.remove("input-error");
});

description.addEventListener("input", ()=> {
    descriptionError.textContent = "";
    description.classList.remove("input-error");
});

loadFromStorage();
displayTransactions();