// Dashboard Page Logic

async function loadDashboard() {
    try {
        Utils.showLoading();
        const response = await API.get('/dashboard');

        if (response.success) {
            displaySummaryCards(response.data.summary);
            displayRecentAllocations(response.data.recentAllocations);
            displayRecentPayments(response.data.recentPayments);
        } else {
            Utils.showError('Failed to load dashboard');
        }
    } catch (error) {
        Utils.showError('Error loading dashboard: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function displaySummaryCards(summary) {
    const container = document.getElementById('summaryCards');
    const cards = `
        <div class="card">
            <h3>👨‍🎓 Total Students</h3>
            <p class="value">${summary.totalStudents || 0}</p>
        </div>
        <div class="card">
            <h3>🛏️ Total Rooms</h3>
            <p class="value">${summary.totalRooms || 0}</p>
        </div>
        <div class="card">
            <h3>✅ Available Rooms</h3>
            <p class="value">${summary.availableRooms || 0}</p>
        </div>
        <div class="card">
            <h3>🔴 Occupied Rooms</h3>
            <p class="value">${summary.occupiedRooms || 0}</p>
        </div>
        <div class="card">
            <h3>🏢 Total Blocks</h3>
            <p class="value">${summary.totalBlocks || 0}</p>
        </div>
        <div class="card">
            <h3>🧰 Total Facilities</h3>
            <p class="value">${summary.totalFacilities || 0}</p>
        </div>
        <div class="card">
            <h3>💳 Pending Payments</h3>
            <p class="value">${summary.pendingPayments || 0}</p>
        </div>
        <div class="card">
            <h3>🍽️ Total Mess</h3>
            <p class="value">${summary.totalMess || 0}</p>
        </div>
    `;
    container.innerHTML = cards;
}

function displayRecentAllocations(allocations) {
    const container = document.getElementById('recentAllocations');
    
    if (!allocations || allocations.length === 0) {
        container.innerHTML = '<p>No recent allocations</p>';
        return;
    }

    const table = `
        <table class="table">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Room Number</th>
                    <th>Block</th>
                    <th>Allocation Date</th>
                </tr>
            </thead>
            <tbody>
                ${allocations.map(allocation => `
                    <tr>
                        <td>${allocation.name}</td>
                        <td>${allocation.room_number}</td>
                        <td>${allocation.block_name}</td>
                        <td>${Utils.formatDate(allocation.allocation_date)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}

function displayRecentPayments(payments) {
    const container = document.getElementById('recentPayments');
    
    if (!payments || payments.length === 0) {
        container.innerHTML = '<p>No recent payments</p>';
        return;
    }

    const table = `
        <table class="table">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${payments.map(payment => `
                    <tr>
                        <td>${payment.name}</td>
                        <td>${Utils.formatCurrency(payment.amount)}</td>
                        <td>${Utils.formatDate(payment.payment_date)}</td>
                        <td><span class="badge badge-${payment.status.toLowerCase()}">${payment.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}

console.log('✅ Dashboard module loaded');