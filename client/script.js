document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-task');

        const fetchTasks = () => {
            fetch('/api/taskLists')
                .then(response => response.json())
                .then(tasks => {
                    console.log('Tasks:', tasks);
                })
                .catch(error => console.error('Error:', error));
        };
    
        fetchTasks();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('/api/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
