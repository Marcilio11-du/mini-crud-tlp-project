        let users = [];
        let editingUserId = null;

        const form = document.getElementById('addUserForm');
        const usersTableBody = document.querySelector('#usersTable tbody');
        const editModal = document.getElementById('editUserModal');
        const editForm = document.getElementById('editForm');
        const cancelBtn = document.querySelector('.cancel-btn');

        // ===== Create =====
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const birthDate = document.getElementById('birthDate').value;

            const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

            const newUser = {
                id,
                name,
                email,
                password,
                birthDate,
                createdAt: new Date().toLocaleDateString('pt-PT'),
                updatedAt: null
            };

            users.push(newUser);
            renderTable();
            form.reset();
        });

        // ===== Read =====
        function renderTable() {
            usersTableBody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${maskPassword(user.password)}</td>
                    <td>${user.birthDate}</td>
                    <td>${user.createdAt}</td>
                    <td>${user.updatedAt || '-'}</td>
                    <td>
                        <button class="edit-btn" data-id="${user.id}">Editar</button>
                        <button class="delete-btn" data-id="${user.id}">Eliminar</button>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });

            // Adicionar event listeners aos botões de editar e eliminar
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', openEditModal);
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', deleteUser);
            });
        }

        // ===== Update =====
        function openEditModal(e) {
            const id = parseInt(e.target.dataset.id);
            const user = users.find(u => u.id === id);

            if (user) {
                editingUserId = id;
                document.getElementById('editName').value = user.name;
                document.getElementById('editEmail').value = user.email;
                document.getElementById('editPassword').value = user.password;
                document.getElementById('editBirthDate').value = user.birthDate;
                editModal.showModal();
            }
        }

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const user = users.find(u => u.id === editingUserId);

            if (user) {
                user.name = document.getElementById('editName').value;
                user.email = document.getElementById('editEmail').value;
                user.password = document.getElementById('editPassword').value;
                user.birthDate = document.getElementById('editBirthDate').value;
                user.updatedAt = new Date().toLocaleDateString('pt-PT');

                renderTable();
                editModal.close();
                editingUserId = null;
            }
        });

        cancelBtn.addEventListener('click', () => {
            editModal.close();
            editingUserId = null;
        });

        // ===== Delete =====
        function deleteUser(e) {
            const id = parseInt(e.target.dataset.id);

            if (confirm('Tem a certeza que deseja eliminar este utilizador?')) {
                users = users.filter(u => u.id !== id);
                renderTable();
            }
        }

        // ===== Funções Auxiliares =====
        function maskPassword(password) {
            return '*'.repeat(password.length);
        }

        renderTable();