     export const addTasksInlist = (data, onSuccess) => {
            return fetch('/api/addTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            
            .then(data => {
                console.log('Success:', data);
                if (onSuccess) onSuccess()
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }



        