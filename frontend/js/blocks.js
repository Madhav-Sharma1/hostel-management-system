// Blocks Page Logic

let blocks = [];
let selectedBlock = null;

async function loadBlocks() {
    try {
        Utils.showLoading();
        const response = await API.get('/blocks');

        if (response.success) {
            blocks = response.data;
            displayBlocks();
        } else {
            Utils.showError(response.message || 'Failed to load blocks');
        }
    } catch (error) {
        Utils.showError('Error loading blocks: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function displayBlocks() {
    const tbody = document.getElementById('blocksTbody');
    
    if (blocks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No blocks found</td></tr>';
        return;
    }

    tbody.innerHTML = blocks.map(block => `
        <tr>
            <td>${block.block_name}</td>
            <td>${block.location || '-'}</td>
            <td>
                <button class="btn-edit" onclick="viewBlockDetails(${block.block_id})">👁️ View</button>
                <button class="btn-delete" onclick="deleteBlock(${block.block_id})">🗑️ Delete</button>
            </td>
        </tr>
    `).join('');
}

function toggleBlockForm() {
    const form = document.getElementById('blockForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function cancelBlockForm() {
    toggleBlockForm();
    document.getElementById('blockFormElement').reset();
}

async function saveBlock() {
    try {
        Utils.showLoading();
        const formData = new FormData(document.getElementById('blockFormElement'));
        const data = Object.fromEntries(formData);

        const response = await API.post('/blocks', data);

        if (response.success) {
            Utils.showSuccess('Block created successfully');
            await loadBlocks();
            cancelBlockForm();
        } else {
            Utils.showError(response.message || 'Failed to create block');
        }
    } catch (error) {
        Utils.showError('Error creating block: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

async function viewBlockDetails(blockId) {
    try {
        Utils.showLoading();
        const response = await API.get(`/blocks/${blockId}`);

        if (response.success) {
            displayBlockDetails(response.data);
        } else {
            Utils.showError(response.message || 'Failed to load block details');
        }
    } catch (error) {
        Utils.showError('Error loading block details: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

function displayBlockDetails(block) {
    const detailsDiv = document.getElementById('blockDetails');
    if (!detailsDiv) return;

    const facilitiesList = block.facilities && block.facilities.length > 0
        ? block.facilities.map(f => `<li>${f.facility_name}</li>`).join('')
        : '<li>No facilities assigned</li>';

    detailsDiv.innerHTML = `
        <div class="section">
            <h3>${block.block_name}</h3>
            <p><strong>Location:</strong> ${block.location || '-'}</p>
            <h4>Facilities:</h4>
            <ul>${facilitiesList}</ul>
            <button class="btn-primary" onclick="closeBlockDetails()">Close</button>
        </div>
    `;
}

function closeBlockDetails() {
    const detailsDiv = document.getElementById('blockDetails');
    if (detailsDiv) {
        detailsDiv.innerHTML = '';
    }
}

async function deleteBlock(blockId) {
    if (!confirm('Are you sure you want to delete this block?')) return;

    try {
        Utils.showLoading();
        const response = await API.delete(`/blocks/${blockId}`);

        if (response.success) {
            Utils.showSuccess('Block deleted successfully');
            await loadBlocks();
        } else {
            Utils.showError(response.message || 'Failed to delete block');
        }
    } catch (error) {
        Utils.showError('Error deleting block: ' + error.message);
    } finally {
        Utils.hideLoading();
    }
}

console.log('✅ Blocks module loaded');