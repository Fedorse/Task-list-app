export const creatTask = async (data) => {
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
};


export const updateTask = async (taskId, data) => {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const resultText = await response.text();
        console.log('update response:', resultText);
        return resultText;    
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
};


export const removeTask = async (taskId) => {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const resultText = await response.text();
        console.log('Delete response:', resultText);
        return resultText;

    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
};

export const getTaskById = async (taskId) => {
    try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const task = await response.json();
        return task;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
