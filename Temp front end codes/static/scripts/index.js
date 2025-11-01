const API_URL = 'http://localhost:5000';
        let previousModules = [];

        function loadModules() {
            fetch(`${API_URL}/modules`)
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('moduleTableBody');
                    tbody.innerHTML = '';
                    
                    if (data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="4">No modules found</td></tr>';
                        return;
                    }
                    
                    data.forEach(module => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${module.module_id}</td>
                            <td>${module.cam_id}</td>
                            <td>${module.status}</td>
                            <td>${module.weight}</td>
                        `;
                        tbody.appendChild(row);
                    });

                    // Check if weight has changed
                    checkWeightChanges(data);
                    previousModules = data;
                })
                .catch(error => {
                    console.error('Error loading modules:', error);
                    document.getElementById('moduleTableBody').innerHTML = 
                        '<tr><td colspan="4">Error loading modules</td></tr>';
                });
        }

        function checkWeightChanges(currentModules) {
            currentModules.forEach(currentModule => {
                const previousModule = previousModules.find(m => m.module_id === currentModule.module_id);
                if (previousModule && previousModule.weight !== currentModule.weight) {
                    console.log(`Weight changed for ${currentModule.module_id}: ${previousModule.weight} -> ${currentModule.weight}`);
                }
            });
        }

        // Load modules on page load
        loadModules();

        // Auto-refresh every 2 seconds to detect weight changes
        setInterval(loadModules, 2000);