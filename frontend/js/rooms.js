// Rooms Page Logic

let rooms = [];
let blocks = [];
let editingRoomId = null;

async function loadRooms() {
    try {
        Utils.showLoading();
        const response = await API.get('/rooms');

        if (response.success) {
            rooms = response.data;
            displayRooms();
        } else {
            Utils.showError(response.message || 'Failed to load rooms');
        }
    } catch (error) {
        Utils.showError('Error loading rooms: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function displayRooms() {
    const tbody = document.getElementById('roomsTbody');
    
    if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No rooms found</td></tr>';
        return;
    }

    tbody.innerHTML = rooms.map(room => `
        <tr>
            <td>${room.room_number}</td>
            <td>${room.block_name}</td>
            <td>${room.room_type}</td>
            <td>${room.capacity}</td>
            <td>
                <span class="badge badge-${room.status.toLowerCase()}">
                    ${room.status}
                </span>
            </td>
            <td>
                <button class="btn-edit" onclick="editRoom(${room.room_id})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteRoom(${room.room_id})">🗑️ Delete</button>
            </td>
        </tr>
    `).join('');
}

async function loadBlocksForForm() {
    try {
        const response = await API.get('/blocks');
        if (response.success) {
            blocks = response.data;
            populateBlockSelect();
        }
    } catch (error) {
        console.error('Error loading blocks:', error);
    }
}

function populateBlockSelect() {
    const select = document.getElementById('roomBlock');
    const options = blocks.map(block => 
        `<option value="${block.block_id}">${block.block_name}</option>`
    ).join('');
    
    if (select) {
        select.innerHTML = '<option value="">Select Block</option>' + options;
    }
}

function toggleRoomForm() {
    const form = document.getElementById('roomForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function cancelRoomForm() {
    toggleRoomForm();
    cancelRoomEdit();
}

async function saveRoom() {
    try {
        Utils.showLoading();
        const formData = new FormData(document.getElementById('roomFormElement'));
        const data = Object.fromEntries(formData);

        let response;
        if (editingRoomId) {
            response = await API.put(`/rooms/${editingRoomId}`, data);
        } else {
            response = await API.post('/rooms', data);
        }

        if (response.success) {
            Utils.showSuccess(editingRoomId ? 'Room updated successfully' : 'Room created successfully');
            await loadRooms();
            cancelRoomForm();
        } else {
            Utils.showError(response.message || 'Failed to save room');
        }
    } catch (error) {
        Utils.showError('Error saving room: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function editRoom(id) {
    const room = rooms.find(r => r.room_id === id);
    if (!room) return;

    editingRoomId = id;
    document.getElementById('roomBlock').value = room.block_id;
    document.getElementById('roomNumber').value = room.room_number;
    document.getElementById('roomType').value = room.room_type;
    document.getElementById('roomCapacity').value = room.capacity;

    document.getElementById('roomForm').style.display = 'block';
    document.querySelector('#roomFormElement button[type="submit"]').textContent = 'Update Room';
}

function cancelRoomEdit() {
    editingRoomId = null;
    document.getElementById('roomFormElement').reset();
    document.querySelector('#roomFormElement button[type="submit"]').textContent = 'Save Room';
}

async function deleteRoom(id) {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
        Utils.showLoading();
        const response = await API.delete(`/rooms/${id}`);

        if (response.success) {
            Utils.showSuccess('Room deleted successfully');
            await loadRooms();
        } else {
            Utils.showError(response.message || 'Failed to delete room');
        }
    } catch (error) {
        Utils.showError('Error deleting room: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

console.log('✅ Rooms module loaded');