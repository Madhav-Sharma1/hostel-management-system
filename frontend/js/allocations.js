// Allocations Page Logic

let allocations = [];
let students = [];
let emptyRooms = [];

async function loadAllocations() {
    try {
        Utils.showLoading();
        const response = await API.get('/allocations');

        if (response.success) {
            allocations = response.data;
            displayAllocations();
        } else {
            Utils.showError(response.message || 'Failed to load allocations');
        }
    } catch (error) {
        Utils.showError('Error loading allocations: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function displayAllocations() {
    const tbody = document.getElementById('allocationsTbody');
    
    if (allocations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No allocations found</td></tr>';
        return;
    }

    tbody.innerHTML = allocations.map(allocation => `
        <tr>
            <td>${allocation.name}</td>
            <td>${allocation.phone}</td>
            <td>${allocation.room_number}</td>
            <td>${allocation.block_name}</td>
            <td>${Utils.formatDate(allocation.allocation_date)}</td>
            <td>
                <span class="badge badge-${allocation.status.toLowerCase()}">
                    ${allocation.status}
                </span>
            </td>
            <td>
                ${allocation.status === 'Active' ? `
                    <button class="btn-delete" onclick="deallocateRoom(${allocation.allocation_id})">
                        🔓 Deallocate
                    </button>
                ` : '-'}
            </td>
        </tr>
    `).join('');
}

async function loadStudentsForForm() {
    try {
        const response = await API.get('/students');
        if (response.success) {
            students = response.data;
            populateStudentSelect('allocationStudent');
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function loadEmptyRoomsForForm() {
    try {
        const response = await API.get('/rooms/empty');
        if (response.success) {
            emptyRooms = response.data;
            populateRoomSelect();
        }
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

function populateStudentSelect(elementId) {
    const select = document.getElementById(elementId);
    if (!select) return;
    
    const options = students.map(student => 
        `<option value="${student.student_id}">${student.name} (ID: ${student.student_id})</option>`
    ).join('');
    
    select.innerHTML = '<option value="">Select Student</option>' + options;
}

function populateRoomSelect() {
    const select = document.getElementById('allocationRoom');
    if (!select) return;
    
    const options = emptyRooms.map(room => 
        `<option value="${room.room_id}">${room.block_name} - Room ${room.room_number}</option>`
    ).join('');
    
    select.innerHTML = '<option value="">Select Room</option>' + options;
}

function toggleAllocationForm() {
    const form = document.getElementById('allocationForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function cancelAllocationForm() {
    toggleAllocationForm();
    document.getElementById('allocationFormElement').reset();
}

async function saveAllocation() {
    try {
        Utils.showLoading();
        const formData = new FormData(document.getElementById('allocationFormElement'));
        const data = Object.fromEntries(formData);

        if (!data.allocation_date) {
            data.allocation_date = new Date().toISOString().split('T')[0];
        }

        const response = await API.post('/allocations', data);

        if (response.success) {
            Utils.showSuccess('Room allocated successfully');
            await loadAllocations();
            await loadEmptyRoomsForForm();
            cancelAllocationForm();
        } else {
            Utils.showError(response.message || 'Failed to allocate room');
        }
    } catch (error) {
        Utils.showError('Error allocating room: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

async function deallocateRoom(allocationId) {
    if (!confirm('Are you sure you want to deallocate this room?')) return;

    try {
        Utils.showLoading();
        const response = await API.put(`/allocations/deallocate/${allocationId}`);

        if (response.success) {
            Utils.showSuccess('Room deallocated successfully');
            await loadAllocations();
            await loadEmptyRoomsForForm();
        } else {
            Utils.showError(response.message || 'Failed to deallocate room');
        }
    } catch (error) {
        Utils.showError('Error deallocating room: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

console.log('✅ Allocations module loaded');