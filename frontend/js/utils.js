// Utility Functions

const Utils = {
    // Format date
    formatDate(dateString) {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    // Format currency
    formatCurrency(amount) {
        return '₹' + parseFloat(amount).toFixed(2);
    },

    // Show error message
    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.textContent = '❌ ' + message;
        document.body.insertBefore(alert, document.body.firstChild);
        setTimeout(() => alert.remove(), 5000);
    },

    // Show success message
    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = '✅ ' + message;
        document.body.insertBefore(alert, document.body.firstChild);
        setTimeout(() => alert.remove(), 5000);
    },

    // Show loading spinner
    showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.id = 'globalLoader';
        document.body.appendChild(loader);
    },

    // Hide loading spinner
    hideLoading() {
        const loader = document.getElementById('globalLoader');
        if (loader) loader.remove();
    },

    // Confirm action
    confirmAction(message) {
        return confirm(message);
    },

    // Create table row
    createTableRow(data, actions = []) {
        const row = document.createElement('tr');
        row.innerHTML = data;
        return row;
    }
};

console.log('✅ Utils module loaded');