import { creatTask } from '/api/tasksApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-task');
    const list = document.querySelector('.list')

    const getTasks = async () => {
        try {
            const response = await fetch('/api/tasks')
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return await response.json()
        } catch (error) {
            console.log('Error fetching tasks :', error)
            return []
        }
    }

    const addClickHandlerToListItems = () => {
        list.addEventListener('click', (event) => {
            const item = event.target.closest('.task');
            if (item) {
                const title = item.getAttribute('data-title');
                const description = item.getAttribute('data-description');
                form.elements['titlTask'].value = title;
                form.elements['descriptionTask'].value = description;
            }
        });
    };

    const renderTasks = async () => {
        const tasks = await getTasks()
        const tasksHtml = tasks.map(task => 
            `<div class="task" data-title="${task.titlTask}" data-description="${task.descriptionTask}">
                <h3 class="task-title">${task.titlTask}</h3>
            </div>`
        ).join('');
        document.querySelector('.list').innerHTML = tasksHtml;
        addClickHandlerToListItems()
    }

    const formDataToJson = formData => JSON.stringify(Object.fromEntries(formData))



    const isValidFormData = (formData) => {
        return formData.get('titlTask') && formData.get('descriptionTask');
    };

    const handleSubmit = async (formData) => {
        if (!isValidFormData(formData)) {
            console.error('All fields are required');
            return;
        }
    
        try {
            const data = formDataToJson(formData);
            await creatTask(data);
            await renderTasks();
        } catch (error) {
            console.error('Error:', error);
        }
    };



    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        const formData = new FormData(form)
        await handleSubmit(formData);


        if (!isValidFormData(formData)) {
            console.error('All fields are required');
            return;
        }
    })
    
    renderTasks()
})
