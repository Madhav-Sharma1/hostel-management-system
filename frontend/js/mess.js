// Mess Page Logic

let mess = [];
let messStudents = [];

async function loadMess() {
    try {
        Utils.showLoading();
        const response = await API.get('/mess');

        if (response.success) {
            mess = response.data;
            displayMess();
        } else {
            Utils.showError(response.message || 'Failed to load mess');
        }
    } catch (error) {
        Utils.showError('Error loading mess: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function displayMess() {
    const tbody = document.getElementById('messTbody');
    
    if (mess.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No mess found</td></tr>';
        return;
    }

    tbody.innerHTML = mess.map(m => `
        <tr>
            <td>${m.mess_name}</td>
            <td>${Utils.formatCurrency(m.fee)}</td>
            <td>${m.coupon || '-'}</td>
        </tr>
    `).join('');
}

function toggleMessForm() {
    const form = document.getElementById('messForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function cancelMessForm() {
    toggleMessForm();
    document.getElementById('messFormElement').reset();
}

async function saveMess() {
    try {
        Utils.showLoading();
        const formData = new FormData(document.getElementById('messFormElement'));
        const data = Object.fromEntries(formData);

        const response = await API.post('/mess', data);

        if (response.success) {
            Utils.showSuccess('Mess created successfully');
            await loadMess();
            cancelMessForm();
        } else {
            Utils.showError(response.message || 'Failed to create mess');
        }
    } catch (error) {
        Utils.showError('Error creating mess: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function toggleMessSubscribeForm() {
    const form = document.getElementById('messSubscribeForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function cancelMessSubscribeForm() {
    toggleMessSubscribeForm();
    document.getElementById('messSubscribeFormElement').reset();
}

async function loadStudentsForMessForm() {
    try {
        const response = await API.get('/students');
        if (response.success) {
            messStudents = response.data;
            populateStudentSelect('messStudent');
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function subscribeToMess() {
    try {
        Utils.showLoading();
        const formData = new FormData(document.getElementById('messSubscribeFormElement'));
        const data = Object.fromEntries(formData);

        const response = await API.post('/mess/subscribe', data);

        if (response.success) {
            Utils.showSuccess('Subscribed to mess successfully');
            cancelMessSubscribeForm();
        } else {
            Utils.showError(response.message || 'Failed to subscribe');
        }
    } catch (error) {
        Utils.showError('Error subscribing to mess: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

console.log('✅ Mess module loaded');