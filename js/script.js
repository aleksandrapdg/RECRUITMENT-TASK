// Variables
const popupCloseBtn = document.querySelector('.cancel');
const addClientForm = document.getElementById('add-new-client-form');
const editClientForm = document.getElementById('edit-client-form');
const list = document.getElementById('list');
const popup = document.querySelector('.popup-wrapper');
let editClient;
let clientList;

// Event Listeners
addClientForm.addEventListener('submit', addClientSubmitHandler);
list.addEventListener('click', listClickHandler);
popupCloseBtn.addEventListener('click', closePopUp);
editClientForm.addEventListener('submit', editClientSubmitHandler);

document.addEventListener('DOMContentLoaded', initList);

// Event Handlers
function addClientSubmitHandler(event) {
	event.preventDefault();

	const name = document.querySelector('#add-new-client-form .name').value;
	const vatNumber = document.querySelector(
		'#add-new-client-form .vat-number'
	).value;
	const city = document.querySelector('#add-new-client-form .city').value;
	const street = document.querySelector('#add-new-client-form .street').value;
	const houseNumber = document.querySelector(
		'#add-new-client-form .house-number'
	).value;
	const createData = new Date().toLocaleDateString('pl-PL');

	// find max id in user list
	let maxId = 0;
	for (let i = 0; i < clientList.length; i++) {
		if (clientList[i].id > maxId) {
			maxId = clientList[i].id;
		}
	}

	const clientDate = {
		id: ++maxId,
		name,
		vatNumber,
		city,
		street,
		houseNumber,
		createData,
	};
	addClientDataInSession(clientDate);
	addClientDataInHtml(clientDate);
	clearAddClientInputs();
}

function listClickHandler(event) {
	const id = event.target.closest('li').dataset.id;
	if (event.target.classList.contains('delete')) {
		deleteClientFromList(id);
	} else if (event.target.classList.contains('edit')) {
		openPopUp(id);
	}
}

function editClientSubmitHandler(event) {
	event.preventDefault();
	const editNameInputValue = document.querySelector(
		'#edit-client-form .edit-name'
	).value;
	const editVatNumberInputValue = document.querySelector(
		'#edit-client-form .edit-vat-number'
	).value;
	const editCityInputValue = document.querySelector(
		'#edit-client-form .edit-city'
	).value;
	const editStreetInputValue = document.querySelector(
		'#edit-client-form .edit-street'
	).value;
	const editHouseNumberInputValue = document.querySelector(
		'#edit-client-form .edit-house-number'
	).value;

	const clientDate = {
		id: editClient.id,
		name: editNameInputValue,
		vatNumber: editVatNumberInputValue,
		city: editCityInputValue,
		street: editStreetInputValue,
		houseNumber: editHouseNumberInputValue,
		createData: editClient.createData,
	};

	editClientDataInSession(clientDate);
	editClientDataInHtml(clientDate);
	closePopUp();
}

// Functions
function deleteClientFromList(id) {
	const elementToRemove = document.querySelector(`li[data-id="${id}"]`);
	clientList = clientList.filter((client) => client.id !== +id);
	sessionStorage.setItem('clientList', JSON.stringify(clientList));
	elementToRemove.remove();
}

function openPopUp(id) {
	fillEditInputValue(id);
	popup.style.display = 'flex';
}

function closePopUp() {
	popup.style.display = 'none';
	editClient = null;
	clearEditClientInputs();
}

function fillEditInputValue(index) {
	const editNameInput = document.querySelector('#edit-client-form .edit-name');
	const editVatNumberInput = document.querySelector(
		'#edit-client-form .edit-vat-number'
	);
	const editCityInput = document.querySelector('#edit-client-form .edit-city');
	const editStreetInput = document.querySelector(
		'#edit-client-form .edit-street'
	);
	const editHouseNumberInput = document.querySelector(
		'#edit-client-form .edit-house-number'
	);

	editClient = clientList.find((client) => client.id === +index);

	editNameInput.value = editClient.name;
	editVatNumberInput.value = editClient.vatNumber;
	editCityInput.value = editClient.city;
	editStreetInput.value = editClient.street;
	editHouseNumberInput.value = editClient.houseNumber;
}

function editClientDataInSession(editClientData) {
	const index = clientList.findIndex(
		(client) => client.id === editClientData.id
	);
	clientList[index] = editClientData;
	sessionStorage.setItem('clientList', JSON.stringify(clientList));
}

function editClientDataInHtml(editClientData) {
	const listItem = document.querySelector(
		`#list li[data-id="${editClientData.id}"]`
	);
	const nameElement = listItem.querySelector('.label-wrapper.name-wrapper p');
	const vatNumberElement = listItem.querySelector(
		'.label-wrapper.vat-number-wrapper p'
	);
	const addressElement = listItem.querySelector(
		'.label-wrapper.address-wrapper p'
	);

	nameElement.textContent = editClientData.name;
	vatNumberElement.textContent = editClientData.vatNumber;
	addressElement.textContent = `${editClientData.city}, ${editClientData.street} ${editClientData.houseNumber}`;
}

function addClientDataInSession(clientData) {
	clientList = JSON.parse(sessionStorage.getItem('clientList'));
	clientList.push(clientData);
	sessionStorage.setItem('clientList', JSON.stringify(clientList));
}

function addClientDataInHtml(client) {
	const li = document.createElement('li');
	li.setAttribute('data-id', client.id);

	const nameWrapper = createLabelWrapper('Name', client.name, 'name-wrapper');
	li.appendChild(nameWrapper);

	const vatWrapper = createLabelWrapper(
		'Vat number',
		client.vatNumber,
		'vat-number-wrapper'
	);
	li.appendChild(vatWrapper);

	const creationDateWrapper = createLabelWrapper(
		'Creation date',
		client.createData,
		'creation-date-wrapper'
	);
	li.appendChild(creationDateWrapper);

	const addressWrapper = createLabelWrapper(
		'Address',
		`${client.city}, ${client.street} ${client.houseNumber}`,
		'address-wrapper'
	);
	li.appendChild(addressWrapper);

	const toolsWrapper = createToolsWrapper();
	li.appendChild(toolsWrapper);

	list.appendChild(li);
}

function generateClientList() {
	for (let i = 0; i < clientList.length; i++) {
		const client = clientList[i];
		addClientDataInHtml(client);
	}
}

function createLabelWrapper(labelText, valueText, identificationClass) {
	const labelWrapper = document.createElement('div');
	labelWrapper.classList.add('label-wrapper', identificationClass);

	const label = document.createElement('span');
	label.textContent = labelText;
	labelWrapper.appendChild(label);

	const value = document.createElement('p');
	value.textContent = valueText;
	labelWrapper.appendChild(value);

	return labelWrapper;
}

function createToolsWrapper() {
	const toolsWrapper = document.createElement('div');
	toolsWrapper.classList.add('tools');

	const deleteButton = document.createElement('button');
	deleteButton.classList.add('delete');
	deleteButton.textContent = 'DELETE';
	toolsWrapper.appendChild(deleteButton);

	const editButton = document.createElement('button');
	editButton.classList.add('edit');
	editButton.textContent = 'EDIT';
	toolsWrapper.appendChild(editButton);

	return toolsWrapper;
}

function clearAddClientInputs() {
	const inputList = document.querySelectorAll('#add-new-client-form input');
	inputList.forEach((input) => (input.value = ''));
}

function clearEditClientInputs() {
	const inputList = document.querySelectorAll('#edit-client-form input');
	inputList.forEach((input) => (input.value = ''));
}

function initializeClientList() {
	if (!sessionStorage.getItem('clientList')) {
		clientList = [];
		sessionStorage.setItem('clientList', JSON.stringify(clientList));
	} else {
		clientList = JSON.parse(sessionStorage.getItem('clientList'));
	}
}

function initList() {
	initializeClientList();
	generateClientList();
}
