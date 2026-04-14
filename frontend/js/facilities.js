// Facilities Page Logic

let facilities = [];
let blockFacilities = [];
let blocks = [];

async function loadFacilities() {
    try {
        Utils.showLoading();
        const response = await API.get('/facilities');

        if (response.success) {
            facilities = response.data;
            displayFacilities();
        } else {
            Utils.showError(response.message || 'Failed to load facilities');
        }
    } catch (error) {
        Utils.showError('Error loading facilities: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

async function loadBlockFacilities() {
    try {
        Utils.showLoading();
        const response = await API.get('/facilities/block-wise');

        if (response.success) {
            blockFacilities = response.data;
            displayBlockFacilities();
        } else {
            Utils.showError(response.message || 'Failed to load block facilities');
        }
    } catch (error) {
        Utils.showError('Error loading block facilities: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function displayFacilities() {
    const tbody = document.getElementById('facilitiesTbody');
    
    if (facilities.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" class="text-center">No facilities found</td></tr>';
        return;
    }

    tbody.innerHTML = facilities.map(facility => `
        <tr>
            <td>${facility.facility_name}</td>
            <td>
                <span class="badge badge-${facility.availability.toLowerCase()}">
                    ${facility.availability}
                </span>
            </td>
        </tr>
    `).join('');
}

function displayBlockFacilities() {
    const tbody = document.getElementById('blockFacilitiesTbody');
    
    if (blockFacilities.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No facilities assigned</td></tr>';
        return;
    }

    tbody.innerHTML = blockFacilities.map(bf => `
        <tr>
            <td>${bf.block_name}</td>
            <td>${bf.facility_name}</td>
            <td>
                <span class="badge badge-${bf.availability.toLowerCase()}">
                    ${bf.availability}
                </span>
            </td>
        </tr>
    `).join('');
}

function toggleFacilityForm() {
    const form = document.getElementById('facilityForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function cancelFacilityForm() {
    toggleFacilityForm();
    document.getElementById('facilityFormElement').reset();
}

async function saveFacility() {
    try {
        Utils.showLoading();
        const formData = new FormData(document.getElementById('facilityFormElement'));
        const data = Object.fromEntries(formData);

        const response = await API.post('/facilities', data);

        if (response.success) {
            Utils.showSuccess('Facility created successfully');
            await loadFacilities();
            cancelFacilityForm();
        } else {
            Utils.showError(response.message || 'Failed to create facility');
        }
    } catch (error) {
        Utils.showError('Error creating facility: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function toggleAssignForm() {
    const form = document.getElementById('assignForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function cancelAssignForm() {
    toggleAssignForm();
    document.getElementById('assignFormElement').reset();
}

async function loadBlocksForFacilityForm() {
    try {
        const response = await API.get('/blocks');
        if (response.success) {
            blocks = response.data;
            populateBlockSelect('facilityBlock');
        }
    } catch (error) {
        console.error('Error loading blocks:', error);
    }
}

async function assignFacility() {
    try {
        Utils.showLoading();
        const formData = new FormData(document.getElementById('assignFormElement'));
        const data = Object.fromEntries(formData);

        const response = await API.post('/facilities/assign', data);

        if (response.success) {
            Utils.showSuccess('Facility assigned to block successfully');
            await loadBlockFacilities();
            cancelAssignForm();
        } else {
            Utils.showError(response.message || 'Failed to assign facility');
        }
    } catch (error) {
        Utils.showError('Error assigning facility: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

console.log('✅ Facilities module loaded');