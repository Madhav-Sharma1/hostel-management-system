// Students Page Logic

let students = [];
let editingStudentId = null;

async function loadStudents() {
    try {
        Utils.showLoading();
        const response = await API.get('/students');

        if (response.success) {
            students = response.data;
            displayStudents();
        } else {
            Utils.showError(response.message || 'Failed to load students');
        }
    } catch (error) {
        Utils.showError('Error loading students: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function displayStudents() {
    const tbody = document.getElementById('studentsTbody');
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No students found</td></tr>';
        return;
    }

    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.student_id}</td>
            <td>${student.name}</td>
            <td>${student.phone}</td>
            <td>${student.gender || '-'}</td>
            <td>${Utils.formatDate(student.dob)}</td>
            <td>
                <button class="btn-edit" onclick="editStudent(${student.student_id})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteStudent(${student.student_id})">🗑️ Delete</button>
            </td>
        </tr>
    `).join('');
}

function toggleStudentForm() {
    const form = document.getElementById('studentForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function cancelStudentForm() {
    toggleStudentForm();
    cancelEdit();
}

async function saveStudent() {
    try {
        Utils.showLoading();
        const formData = new FormData(document.getElementById('studentFormElement'));
        const data = Object.fromEntries(formData);

        let response;
        if (editingStudentId) {
            response = await API.put(`/students/${editingStudentId}`, data);
        } else {
            response = await API.post('/students', data);
        }

        if (response.success) {
            Utils.showSuccess(editingStudentId ? 'Student updated successfully' : 'Student created successfully');
            await loadStudents();
            cancelStudentForm();
        } else {
            Utils.showError(response.message || 'Failed to save student');
        }
    } catch (error) {
        Utils.showError('Error saving student: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function editStudent(id) {
    const student = students.find(s => s.student_id === id);
    if (!student) return;

    editingStudentId = id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentDOB').value = student.dob || '';
    document.getElementById('studentGender').value = student.gender || '';
    document.getElementById('studentPhone').value = student.phone;
    document.getElementById('studentParentPhone').value = student.parent_number || '';

    document.getElementById('studentForm').style.display = 'block';
    document.querySelector('#studentFormElement button[type="submit"]').textContent = 'Update Student';
}

function cancelEdit() {
    editingStudentId = null;
    document.getElementById('studentFormElement').reset();
    document.querySelector('#studentFormElement button[type="submit"]').textContent = 'Save Student';
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        Utils.showLoading();
        const response = await API.delete(`/students/${id}`);

        if (response.success) {
            Utils.showSuccess('Student deleted successfully');
            await loadStudents();
        } else {
            Utils.showError(response.message || 'Failed to delete student');
        }
    } catch (error) {
        Utils.showError('Error deleting student: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

console.log('✅ Students module loaded');