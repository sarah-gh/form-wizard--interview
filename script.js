const stages = ["آماده‌سازی قرارداد", "متن قرارداد", "تایید هویت", "مرحله 4", "مرحله 5", "مرحله 6"];
const contractListElement = document.getElementById('contractList');
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
let currentStep = 1;
let contracts = [];

// step management
function showStep(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((stepElem) => stepElem.classList.remove('active'));
    steps[step - 1].classList.add('active');
    updateStageDisplay(step);
}

async function nextStep() {
    if (currentStep < stages.length) {
        const valid = await validityState(currentStep)
        if (valid) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function updateStageDisplay(step) {
    const circles = document.querySelectorAll('.stage-circle');
    const lines = document.querySelectorAll('.stage-line');

    circles.forEach((circle, i) => {
        if (step > 2 && step < stages.length) {
            circle.setAttribute('data-stage', stages[step + i - 2]);
            if (i === 0) {
                circle.classList.add('completed');
                circle.classList.remove('in-progress', 'not-completed');
            } else if (i === 1) {
                circle.classList.add('in-progress');
                circle.classList.remove('completed', 'not-completed');
            } else {
                circle.classList.add('not-completed');
                circle.classList.remove('completed', 'in-progress');
            }
        } else {
            switch (step) {
                case 1:
                    circle.setAttribute('data-stage', stages[i]);
                    break;
                case 2:
                    circle.setAttribute('data-stage', stages[step + i - 2]);
                    break;
                default:
                    circle.setAttribute('data-stage', stages[step + i - 3]);
                    break;
            }
            if (step == stages.length) {
                if (i == 0 || i == 1) {
                    circle.classList.add('completed');
                    circle.classList.remove('in-progress', 'not-completed');
                } else {
                    circle.classList.add('in-progress');
                    circle.classList.remove('completed', 'not-completed');
                }
            } else {
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
            }
        }
    });

    lines.forEach((line, i) => {
        if (step > 2 && step < stages.length) {
            if (i == 0) {
                line.classList.add('active-line');
            } else {
                line.classList.remove('active-line', 'bold');
            }
        } else {
            if (i < step - 1) {
                line.classList.add('active-line');
            } else {
                line.classList.remove('active-line', 'bold');
            }
        }

    });

    if (step === circles.length) {
        lines[circles.length - 2].classList.add('bold');
    }
}

// form management
function submitForm() {
    alert('Form submitted successfully!');
}

function changeValueFrm(name) {
    let lbl = document.getElementById(name + "-lbl");
    let inp = document.getElementById(name + "-inp");
    let frm = document.getElementById(name + "-frm");
    if (frm.type == 'select-one') {
        inp.value = frm.value
        for (let item of frm.options) {
            if (item.value == inp.value) {
                lbl.innerText = item.innerText
                break;
            }
        }
    }
    else {
        inp.value = frm.value
        lbl.innerText = inp.value
    }

}
// validation step
async function validityState(step) {
    const fullNameTenant = document.getElementById("FullNameTenant-frm").value;
    const nationalCodeTenant = document.getElementById("NationalCodeTenant-frm").value;
    const mobileNumberTenant = document.getElementById("MobileNumberTenant-frm").value;
    const ownerAddressTenant = document.getElementById("OwnerAddressTenant-frm").value;

    switch (step) {
        case 1:
            // Check validity for step 1 fields
            if (fullNameTenant.trim() === "") {
                alert("نام و نام خانوادگی مستاجر را وارد کنید.");
                return false;
            }
            if (nationalCodeTenant.trim() === "") {
                alert("کد ملی مستاجر را وارد کنید.");
                return false;
            }
            if (mobileNumberTenant.trim() === "") {
                alert("شماره موبایل مستاجر را وارد کنید.");
                return false;
            }
            if (ownerAddressTenant.trim() === "") {
                alert("آدرس محل سکونت مستاجر را وارد کنید.");
                return false;
            }
            // Additional validation for national code, mobile number, etc.
            // Add your validation logic here for the specific requirements in step 1.
            break;
        // Additional cases can be added for further steps if needed.
        // case 2:
        //   // Check validity for step 2 fields
        //   break;
        // case 3:
        //   // Check validity for step 3 fields
        //   break;
        default:
            // Unknown step
            return true;
    }

    // If all validations pass, return true.
    return true;
}


// hamburger management
function setupEventListeners() {
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    const addContractForm = document.getElementById('addContractForm');
    addContractForm.addEventListener('submit', handleAddContractFormSubmit);
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

// contract management
function displayContracts() {
    console.log('displayContracts');
    contractListElement.innerHTML = '';
    if (contracts.length == 0) {
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

// modal dialog
function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
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

function init() {
    showStep(currentStep);
    getAllContracts();
    setupEventListeners()
}

init();
