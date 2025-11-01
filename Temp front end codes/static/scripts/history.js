       const API_URL = 'http://localhost:5000';

        function loadHistory() {
            fetch(`${API_URL}/history`)
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('historyTableBody');
                    tbody.innerHTML = '';
                    
                    if (data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="8">No history records found</td></tr>';
                        return;
                    }
                    
                    data.forEach(record => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${record.history_id}</td>
                            <td>${record.created_at}</td>
                            <td>${record.schedule_id || 'N/A'}</td>
                            <td>${record.module_id || 'N/A'}</td>
                            <td>${record.feed_time || 'N/A'}</td>
                            <td>${record.amount || 'N/A'}</td>
                            <td>${record.status || 'N/A'}</td>
                            <td>
                                <button onclick="deleteHistory(${record.history_id})">Delete</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error('Error loading history:', error);
                    document.getElementById('historyTableBody').innerHTML = 
                        '<tr><td colspan="8">Error loading history</td></tr>';
                });
        }

        function deleteHistory(historyId) {
            if (!confirm('Are you sure you want to delete this history record?')) {
                return;
            }
            
            fetch(`${API_URL}/history/${historyId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('History record deleted successfully');
                    loadHistory();
                }
            })
            .catch(error => {
                console.error('Error deleting history:', error);
                alert('Error deleting history record');
            });
        }

        // Load history on page load
        loadHistory();