const API_URL = 'http://localhost:5000';

let isEditing = false;

function loadSchedules() {
    if (isEditing) return;
    
    // Load both modules and schedules
    Promise.all([
        fetch(`${API_URL}/modules`).then(res => res.json()),
        fetch(`${API_URL}/schedules`).then(res => res.json())
    ])
    .then(([modules, schedules]) => {
        const tbody = document.getElementById('schedulesTable');
        tbody.innerHTML = '';
        
        // Filter only active modules
        const activeModules = modules.filter(module => 
            module.status && module.status.toLowerCase() === 'active'
        );
        
        if (activeModules.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No active modules found</td></tr>';
            return;
        }
        
        // Create a row for each active module
        activeModules.forEach(module => {
            // Find the schedule for this module
            const schedule = schedules.find(s => s.module_id === module.module_id);
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${module.module_id}</td>
                <td>${schedule ? schedule.feed_time : 'Not set'}</td>
                <td>${schedule ? schedule.amount : 'Not set'}</td>
                <td>${schedule ? schedule.status : 'pending'}</td>
                <td>
                    <button onclick="editSchedule('${module.module_id}', '${schedule ? schedule.feed_time : ''}', ${schedule ? schedule.amount : 0}, '${schedule ? schedule.status : 'pending'}', ${schedule ? schedule.schedule_id : 'null'})" class="btn-edit">Edit</button>
                </td>
            `;
        });
    })
    .catch(error => {
        console.error('Error loading data:', error);
        document.getElementById('schedulesTable').innerHTML = 
            '<tr><td colspan="5">Error loading data</td></tr>';
    });
}

function editSchedule(moduleId, feedTime, amount, status, scheduleId) {
    isEditing = true;
    const row = event.target.closest('tr');
    
    row.innerHTML = `
        <td>${moduleId}</td>
        <td><input type="time" id="edit_feed_time" value="${feedTime}" /></td>
        <td><input type="number" id="edit_amount" value="${amount}" step="0.01" min="0" /></td>
        <td>${status}</td>
        <td>
            <button onclick="saveSchedule('${moduleId}', ${scheduleId})" class="btn-save">Save</button>
            <button onclick="cancelEdit()" class="btn-cancel">Cancel</button>
        </td>
    `;
}

function saveSchedule(moduleId, scheduleId) {
    const feedTime = document.getElementById('edit_feed_time').value;
    const amount = parseFloat(document.getElementById('edit_amount').value);
    
    if (!feedTime) {
        alert('Feed time is required');
        return;
    }
    
    if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    const data = {
        module_id: moduleId,
        feed_time: feedTime,
        amount: amount,
        status: 'pending'
    };
    
    // If schedule exists, update it; otherwise create new
    const method = scheduleId !== 'null' && scheduleId ? 'PUT' : 'POST';
    const url = scheduleId !== 'null' && scheduleId 
        ? `${API_URL}/schedules/${scheduleId}` 
        : `${API_URL}/schedules`;
    
    fetch(url, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
        alert('Schedule saved successfully');
        isEditing = false;
        loadSchedules();
    })
    .catch(error => {
        console.error('Error saving schedule:', error);
        alert('Error saving schedule');
        isEditing = false;
    });
}

function cancelEdit() {
    isEditing = false;
    loadSchedules();
}

// Load schedules on page load
loadSchedules();