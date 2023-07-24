const stages = ["Contract Preparation", "Contract Text", "Authentication"];
let currentStep = 2;

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

    for (let i = 0; i < circles.length; i++) {
        if (i < step - 1) {
            circles[i].classList.add('completed');
            circles[i].classList.remove('in-progress', 'not-completed');
        } else if (i === step - 1) {
            circles[i].classList.add('in-progress');
            circles[i].classList.remove('completed', 'not-completed');
        } else {
            circles[i].classList.add('not-completed');
            circles[i].classList.remove('completed', 'in-progress');
        }
    }

    for (let i = 0; i < lines.length; i++) {
        if (i < step - 1) {
            lines[i].classList.add('active-line');
        } else {
            lines[i].classList.remove('active-line', 'bold');
        }
    }

    if (step === circles.length) {
        lines[circles.length - 2].classList.add('bold');
    }
}

showStep(currentStep);

const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    menu.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});



const contractListElement = document.getElementById('contractList');

let contracts = [];


// درخواست GET برای دریافت تمام لیست قراردادها
async function getAllContracts() {
    try {
        const response = await fetch('http://localhost:3000/contracts');
        const data = await response.json();
        contracts = data;
        displayContracts();
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayContracts() {
    contractListElement.innerHTML = '';
    contracts.forEach((contract) => {
        const contractItem = document.createElement('div');
        contractItem.className = 'contract-item';
        contractItem.style.backgroundColor = contract.isMandatory ? '#f0f0f0' : '#ffffff';

        const header = document.createElement('div');
        header.className = 'header-item';


        const contractHeader = document.createElement('p');
        contractHeader.textContent = contract.header;
        header.appendChild(contractHeader);

        const contractText = document.createElement('p');
        contractText.className = 'content-text';
        contractText.textContent = contract.text;

        const headerIcon = document.createElement('div');
        headerIcon.className = 'icons-item';

        if (contract.isMandatory) {
            const mandatoryTag = document.createElement('span');
            mandatoryTag.textContent = 'اجباری';
            headerIcon.appendChild(mandatoryTag);
        } else {
            const editIcon = document.createElement('span');
            editIcon.textContent = '🖉'; // ایکون ویرایش
            editIcon.className = 'edit-icon';
            editIcon.addEventListener('click', function (e) {
                e.stopPropagation();
                // اجرای عملیات ویرایش قرارداد
                editContract(contract.id);
            });
            headerIcon.appendChild(editIcon);

            const deleteIcon = document.createElement('span');
            deleteIcon.textContent = '❌'; // ایکون حذف
            deleteIcon.className = 'delete-icon';
            deleteIcon.addEventListener('click', function (e) {
                e.stopPropagation();
                // اجرای عملیات حذف قرارداد
                deleteContract(contract.id);
            });
            headerIcon.appendChild(deleteIcon);
        }
        header.appendChild(headerIcon);

        contractItem.appendChild(header);
        contractItem.appendChild(contractText);

        // افزودن رویداد نمایش متن قرارداد به هر آیتم
        contractItem.onclick = () => displayModal(contract.text);

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


// حذف قرارداد با شناسه مشخص
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

// اضافه کردن رویداد حذف به هر دکمه حذف
function addDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const contractId = parseInt(button.dataset.id);
            deleteContract(contractId);
        });
    });
}


// درخواست نمایش تمام لیست قراردادها در بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function () {
    getAllContracts();
    // اضافه کردن رویداد submit به فرم اضافه کردن قرارداد
    const addContractForm = document.getElementById('addContractForm');
    addContractForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const contractHeader = document.getElementById('contractHeader').value; // اضافه کردن مقدار هدر
        const contractText = document.getElementById('contractText').value;
        const isMandatory = document.getElementById('mandatoryCheckbox').checked; // اضافه کردن وضعیت اجباری بودن

        if (contractText) {
            addContract(contractHeader, contractText, isMandatory);
            closeModal();
        }
    });

});


// باز کردن مودال
function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

// بستن مودال
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

function editContract(contractId, header, text, isMandatory) {
    // پیدا کردن قرارداد مورد نظر با استفاده از contractId
    const contract = contracts.find((c) => c.id === contractId);

    if (contract) {
        // ویرایش اطلاعات قرارداد
        contract.header = header || ''; // اضافه کردن هدر
        contract.text = text; // تغییر متن
        contract.isMandatory = isMandatory; // تغییر وضعیت اجباری بودن

        // نمایش لیست قراردادها بعد از ویرایش
        displayContracts();
    } else {
        console.log('قرارداد با این شناسه یافت نشد.');
    }
}

