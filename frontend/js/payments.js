// Payments Page Logic

let payments = [];
let allPayments = [];
let paymentStudents = [];

async function loadPayments() {
    try {
        Utils.showLoading();
        const response = await API.get('/payments');

        if (response.success) {
            allPayments = response.data;
            payments = response.data;
            displayPayments();
        } else {
            Utils.showError(response.message || 'Failed to load payments');
        }
    } catch (error) {
        Utils.showError('Error loading payments: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function displayPayments() {
    const tbody = document.getElementById('paymentsTbody');
    
    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No payments found</td></tr>';
        return;
    }

    tbody.innerHTML = payments.map(payment => `
        <tr>
            <td>${payment.name}</td>
            <td>${Utils.formatCurrency(payment.amount)}</td>
            <td>${Utils.formatDate(payment.payment_date)}</td>
            <td>${payment.payment_mode}</td>
            <td>
                <select class="status-select" onchange="updatePaymentStatus(${payment.payment_id}, this.value)">
                    <option value="Paid" ${payment.status === 'Paid' ? 'selected' : ''}>Paid</option>
                    <option value="Pending" ${payment.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Failed" ${payment.status === 'Failed' ? 'selected' : ''}>Failed</option>
                </select>
            </td>
        </tr>
    `).join('');
}

async function loadStudentsForPaymentForm() {
    try {
        const response = await API.get('/students');
        if (response.success) {
            paymentStudents = response.data;
            populateStudentSelect('paymentStudent');
            populateFilterSelect();
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function populateFilterSelect() {
    const select = document.getElementById('filterStudent');
    if (!select) return;
    
    const options = paymentStudents.map(student => 
        `<option value="${student.student_id}">${student.name}</option>`
    ).join('');
    
    select.innerHTML = '<option value="">All Students</option>' + options;
}

function togglePaymentForm() {
    const form = document.getElementById('paymentForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function cancelPaymentForm() {
    togglePaymentForm();
    document.getElementById('paymentFormElement').reset();
}

async function savePayment() {
    try {
        Utils.showLoading();
        const formData = new FormData(document.getElementById('paymentFormElement'));
        const data = Object.fromEntries(formData);

        const response = await API.post('/payments', data);

        if (response.success) {
            Utils.showSuccess('Payment recorded successfully');
            await loadPayments();
            cancelPaymentForm();
        } else {
            Utils.showError(response.message || 'Failed to create payment');
        }
    } catch (error) {
        Utils.showError('Error creating payment: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

async function updatePaymentStatus(paymentId, status) {
    try {
        const response = await API.put(`/payments/${paymentId}`, { status });

        if (response.success) {
            Utils.showSuccess('Payment status updated');
            await loadPayments();
        } else {
            Utils.showError(response.message || 'Failed to update payment');
        }
    } catch (error) {
        Utils.showError('Error updating payment: ' + error.message);
    }
}

function filterPaymentsByStudent() {
    const filterValue = document.getElementById('filterStudent').value;
    
    if (filterValue) {
        payments = allPayments.filter(p => p.student_id.toString() === filterValue);
    } else {
        payments = allPayments;
    }
    
    displayPayments();
}

console.log('✅ Payments module loaded');