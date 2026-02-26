// All Views (main)
const views = document.querySelectorAll('main');

// Currentview
if (localStorage.getItem('currentView') !== null) {
    showView()
} else {
    localStorage.setItem('currentView', 0) // [0-4]
    showView()
}

const authToken = localStorage.getItem('authToken')
if (authToken) {
    showPet()
}

// Login form (Post)
const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    try {
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data = await response.json()
        if (response.ok) {
            Swal.fire({
                title: 'Congratulations',
                text: data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 2500
            })
            localStorage.setItem('authToken', data.access_token)
            localStorage.setItem('currentView', 1)
            showView()
            showPet()
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message,
                icon: 'error',
            })
        }

    } catch (error) {
        console.error(error.message)
    }
})

// show pets (Get)
async function showPet() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/pets/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })

        const data = await response.json()
        const petsContainer = document.querySelector('.list')
        petsContainer.innerHTML = ''

        if (Array.isArray(data.pets)) {
            data.pets.forEach(pet => {
                let imageSrc = '';
                if (!pet.image || pet.image === '' || pet.image === 'no-photo.svg' || pet.image === 'no-photo.png') {
                    imageSrc = 'imgs/no-photo.svg';
                } else if (pet.image && !pet.image.startsWith('http')) {
                    imageSrc = 'http://127.0.0.1:8000/images/' + pet.image;
                } else {
                    imageSrc = pet.image;
                }
                petsContainer.innerHTML += `
                        <div class="row">
                            <img src="${imageSrc}" alt="${pet.name}">
                            <div class="data">
                                <h3>${pet.name}</h3>
                                <h4>${pet.kind}: ${pet.breed}</h4>
                            </div>
                            <nav class="actions">
                                <a href="javascript:;" class="btnShow" data-id="${pet.id}"></a>
                                <a href="javascript:;" class="btnEdit" data-id="${pet.id}"></a>
                                <a href="javascript:;" class="btnDelete" data-id="${pet.id}"></a>
                            </nav>
                        </div>
                    `
            })

            // Eventos btnShow
            document.querySelectorAll('.btnShow').forEach(element => {
                element.addEventListener('click', () => {
                    const petId = element.getAttribute('data-id');
                    localStorage.setItem('selectedPetId', petId);
                    localStorage.setItem('currentView', 3);
                    showView();
                    showSelectedPet();
                });
            })

            // Eventos btnEdit
            document.querySelectorAll('.btnEdit').forEach(element => {
                element.addEventListener('click', () => {
                    const petId = element.getAttribute('data-id');
                    localStorage.setItem('selectedPetId', petId);
                    localStorage.setItem('currentView', 4);
                    showView();
                    showEditPet();
                });
            })

            // --- CORRECCIÓN: Eventos btnDelete ---
            document.querySelectorAll('.btnDelete').forEach(element => {
                element.addEventListener('click', () => {
                    const petId = element.getAttribute('data-id');
                    deletePet(petId);
                });
            })
        }
    } catch (error) {
        console.error(error.message)
    }
}

// Función para Borrar Mascota con SweetAlert2
async function deletePet(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4757',
        cancelButtonColor: '#2f3542',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/pets/destroy/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire({ title: '¡Eliminado!', text: data.message, icon: 'success', timer: 1500, showConfirmButton: false });
                    showPet(); // Recargar lista
                } else {
                    Swal.fire('Error', data.error || 'No se pudo eliminar', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Problema de conexión', 'error');
            }
        }
    });
}

// Mostrar mascota (Detalle)
async function showSelectedPet() {
    const petId = localStorage.getItem('selectedPetId');
    if (!petId) return;
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/pets/show/${petId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        const data = await response.json();
        const pet = data.pet;
        if (!pet) return;

        let imageSrc = pet.image && !pet.image.startsWith('http') ? 'http://127.0.0.1:8000/images/' + pet.image : (pet.image || 'imgs/no-photo.svg');

        const showSection = document.querySelector('#show .data');
        if (showSection) {
            showSection.innerHTML = `
                <div class="showContent">
                    <img src="${imageSrc}" class="photo">
                    <div class="field"><label>Name</label><input type="text" value="${pet.name}" disabled /></div>
                    <div class="field"><label>Kind</label><input type="text" value="${pet.kind}" disabled /></div>
                    <div class="field"><label>Age</label><input type="text" value="${pet.age}" disabled /></div>
                    <div class="field"><label>Weight</label><input type="text" value="${pet.weight}" disabled /></div>
                    <div class="field"><label>Breed</label><input type="text" value="${pet.breed}" disabled /></div>
                    <div class="field"><label>Location</label><input type="text" value="${pet.location}" disabled /></div>
                    <div class="field column"><label>Description</label><textarea disabled>${pet.description}</textarea></div>
                </div>`;
        }
    } catch (error) { console.error(error.message); }
}

// Mostrar mascota en Edit
async function showEditPet() {
    const petId = localStorage.getItem('selectedPetId');
    if (!petId) return;
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/pets/show/${petId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        const data = await response.json();
        const pet = data.pet;
        if (!pet) return;

        document.getElementById('editName').value = pet.name;
        document.getElementById('editKind').value = pet.kind;
        document.getElementById('editAge').value = pet.age;
        document.getElementById('editWeight').value = pet.weight;
        document.getElementById('editBreed').value = pet.breed;
        document.getElementById('editLocation').value = pet.location;
        document.getElementById('editDescription').value = pet.description;
        document.getElementById('editPhoto').src = pet.image && !pet.image.startsWith('http') ? 'http://127.0.0.1:8000/images/' + pet.image : (pet.image || 'imgs/no-photo.svg');
        document.getElementById('editOriginImage').value = pet.image || '';

    } catch (error) { console.error(error.message); }
}

// Botones de Navegación y Logout
const btnLogout = document.querySelector('.btnLogout');
const btnAdd = document.querySelector('.btnAdd');
const btnCancels = document.querySelectorAll('.btnCancel, .btnCancels');
const btnBack = document.querySelectorAll('.btnBack');

btnLogout.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.setItem('currentView', 0);
    showView();
});

btnAdd.addEventListener('click', () => {
    localStorage.setItem('currentView', 2);
    showView();
});

btnBack.forEach(el => el.addEventListener('click', () => { localStorage.setItem('currentView', 1); showView(); }));
btnCancels.forEach(el => el.addEventListener('click', () => { localStorage.setItem('currentView', 1); showView(); }));

// Guardar Cambios (Edit)
const btnAgree = document.getElementById('btnAgree');
if (btnAgree) {
    btnAgree.addEventListener('click', async () => {
        const petId = localStorage.getItem('selectedPetId');
        const payload = {
            name: document.getElementById('editName').value,
            kind: document.getElementById('editKind').value,
            weight: document.getElementById('editWeight').value,
            age: document.getElementById('editAge').value,
            breed: document.getElementById('editBreed').value,
            location: document.getElementById('editLocation').value,
            description: document.getElementById('editDescription').value,
        };

        try {
            const fileInput = document.getElementById('editImage');
            const formData = new FormData();
            Object.keys(payload).forEach(k => formData.append(k, payload[k]));
            if (fileInput.files[0]) formData.append('image', fileInput.files[0]);
            formData.append('originimage', document.getElementById('editOriginImage').value);
            formData.append('_method', 'PUT');

            const response = await fetch(`http://127.0.0.1:8000/api/pets/edit/${petId}`, {
                method: 'POST', // Usamos POST + _method PUT para archivos
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            if (response.ok) {
                Swal.fire({ title: 'Updated', icon: 'success', timer: 1500, showConfirmButton: false });
                localStorage.setItem('currentView', 1);
                showView();
                showPet();
            }
        } catch (error) { console.error(error); }
    });
}

// Agregar Mascota (Store)
const btnAddPet = document.getElementById('btnAddPet');
if (btnAddPet) {
    btnAddPet.addEventListener('click', async () => {
        const formData = new FormData();
        formData.append('name', document.getElementById('addName').value);
        formData.append('kind', document.getElementById('addKind').value);
        formData.append('weight', document.getElementById('addWeight').value);
        formData.append('age', document.getElementById('addAge').value);
        formData.append('breed', document.getElementById('addBreed').value);
        formData.append('location', document.getElementById('addLocation').value);
        formData.append('description', document.getElementById('addDescription').value);

        const fileInput = document.getElementById('addImage');
        if (fileInput.files[0]) formData.append('image', fileInput.files[0]);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/pets/store', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            if (response.ok) {
                Swal.fire({ title: 'Created', icon: 'success', timer: 1500, showConfirmButton: false });
                localStorage.setItem('currentView', 1);
                showView();
                showPet();
            } else {
                const data = await response.json();
                Swal.fire('Error', data.message || 'Check fields', 'error');
            }
        } catch (error) { console.error(error); }
    });
}

function showView() {
    views.forEach(element => {
        element.classList.remove('animateView');
        element.style.display = 'none';
    })
    const index = localStorage.getItem('currentView');
    views[index].classList.add('animateView');
    views[index].style.display = 'block';
}