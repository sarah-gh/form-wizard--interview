const stages = ["Contract Preparation", "Contract Text", "Authentication"];
const contractListElement = document.getElementById('contractList');
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
let currentStep = 2;
let contracts = [];

function showStep(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((stepElem) => stepElem.classList.remove('active'));
    steps[step - 1].classList.add('active');
    updateStageDisplay(step);
}

function nextStep() {
    if (currentStep < stages.length) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function submitForm() {
    alert('Form submitted successfully!');
}

function updateStageDisplay(step) {
    const circles = document.querySelectorAll('.stage-circle');
    const lines = document.querySelectorAll('.stage-line');

    circles.forEach((circle, i) => {
        if (i < step - 1) {
            circle.classList.add('completed');
            circle.classList.remove('in-progress', 'not-completed');
        } else if (i === step - 1) {
            circle.classList.add('in-progress');
            circle.classList.remove('completed', 'not-completed');
        } else {
            circle.classList.add('not-completed');
            circle.classList.remove('completed', 'in-progress');
        }
    });

    lines.forEach((line, i) => {
        if (i < step - 1) {
            line.classList.add('active-line');
        } else {
            line.classList.remove('active-line', 'bold');
        }
    });

    if (step === circles.length) {
        lines[circles.length - 2].classList.add('bold');
    }
}

function toggleMenu() {
    menu.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeMenu() {
    menu.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

async function getAllContracts() {
    try {
        const response = await fetch('http://localhost:3000/contracts');
        const data = await response.json();
        contracts = data;
        displayContracts();
    } catch (error) {
        console.error('Error:', error);
        displayContracts();
    }
}

function displayContracts() {
    console.log('displayContracts');
    contractListElement.innerHTML = '';
    if(contracts.length == 0) {
        contractListElement.textContent = 'بک اند اجرا نشده است';
    }
    contracts.forEach((contract) => {
        const contractItem = document.createElement('div');
        contractItem.className = 'contract-item';
        contractItem.style.backgroundColor = contract.isMandatory ? '#f0f0f0' : '#ffffff';

        const header = document.createElement('div');
        header.className = 'header-item';

        const contractHeader = document.createElement('h2');
        contractHeader.textContent = contract.header;
        contractHeader.onclick = () => displayModal(contract.text);
        header.appendChild(contractHeader);

        const maxTextLength = 150;
        const contractText = document.createElement('p');
        contractText.className = 'content-text';

        if (contract.text.length > maxTextLength) {
            contractText.textContent = contract.text.substring(0, maxTextLength) + '...';
        } else {
            contractText.textContent = contract.text;
        }

        const headerIcon = document.createElement('div');
        headerIcon.className = 'icons-item';

        if (contract.isMandatory) {
            const mandatoryTag = document.createElement('span');
            mandatoryTag.textContent = 'اجباری';
            headerIcon.appendChild(mandatoryTag);
        }
        if (!contract.isMandatory) {
            const editIcon = document.createElement('span');
            editIcon.textContent = '🖉';
            editIcon.className = 'edit-icon';
            headerIcon.appendChild(editIcon);

            const deleteIcon = document.createElement('span');
            deleteIcon.textContent = '❌';
            deleteIcon.className = 'delete-icon';
            deleteIcon.addEventListener('click', function (e) {
                e.stopPropagation();
                deleteContract(contract.id);
            });
            headerIcon.appendChild(deleteIcon);
        }

        header.appendChild(headerIcon);
        contractItem.appendChild(header);
        contractItem.appendChild(contractText);
        contractListElement.appendChild(contractItem);
    });
}

function addContract(header, text, isMandatory) {
    fetch('http://localhost:3000/contracts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ header, text, isMandatory })
    })
        .then((response) => response.json())
        .then((data) => {
            contracts.push(data);
            displayContracts();
        })
        .catch((error) => console.error('Error:', error));
}

function deleteContract(id) {
    fetch(`http://localhost:3000/contracts/${id}`, {
        method: 'DELETE'
    })
        .then((response) => response.json())
        .then((data) => {
            contracts = contracts.filter((contract) => contract.id !== id);
            displayContracts();
        })
        .catch((error) => console.error('Error:', error));
}

function handleAddContractFormSubmit(e) {
    e.preventDefault();
    const contractHeader = document.getElementById('contractHeader').value;
    const contractText = document.getElementById('contractText').value;
    const isMandatory = document.getElementById('mandatoryCheckbox').checked;

    if (contractText) {
        addContract(contractHeader, contractText, isMandatory);
        closeModal();
    }
}

function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

function editContract(contractId, header, text, isMandatory) {
    const contract = contracts.find((c) => c.id === contractId);

    if (contract) {
        contract.header = header || '';
        contract.text = text;
        contract.isMandatory = isMandatory;
        displayContracts();
    } else {
        console.log('Contract not found with this ID.');
    }
}

function displayModal(fullText) {
    const modalText = document.getElementById('modalText');
    modalText.textContent = fullText;

    const modal = document.getElementById('myModal2');
    modal.style.display = 'block';
}

function closeModal2() {
    const modal = document.getElementById('myModal2');
    modal.style.display = 'none';
}

function setupEventListeners() {
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    const addContractForm = document.getElementById('addContractForm');
    addContractForm.addEventListener('submit', handleAddContractFormSubmit);
}

function init() {
    showStep(currentStep);
    getAllContracts();
    setupEventListeners();
}

init();
