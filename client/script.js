import { creatTask } from '/api/tasksApi.js';
import { removeTask } from '/api/tasksApi.js';
import { updateTask } from '/api/tasksApi.js';
// import { getTasks } from '/utils/TaskService.js'
// import { addClickHandlerToListItems } from '/utils/UIHandler.js'
// import { renderTasks } from '/utils/UIHandler.js'
// import { formDataToJson } from '/utils/FormUtils.js'
// import { isValidFormData } from '/utils/FormUtils.js'




document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-task');
    const list = document.querySelector('.list')
    const remove = document.querySelector('.deleteBtn')
    const update = document.querySelector('.updateTask')

    let currentSelectedTaskId = null;



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
                const taskId = item.getAttribute('data-id');
                currentSelectedTaskId = taskId; 
                console.log('id :', currentSelectedTaskId)
                form.elements['titlTask'].value = title;
                form.elements['descriptionTask'].value = description;
            }
        });
    };

    const renderTasks = async () => {
        const tasks = await getTasks()
        console.log(tasks)
        const tasksHtml = tasks.map(task => 
            `<div class="task" 
            data-id="${task._id}"
            data-title="${task.titlTask}" 
            data-description="${task.descriptionTask}">
            <h3 class="task-title">${task.titlTask}</h3>
            </div>`
        ).join('');
        document.querySelector('.list').innerHTML = tasksHtml;
        addClickHandlerToListItems()
    }

    remove.addEventListener('click', async () =>{
        if(currentSelectedTaskId){
            try {
                await removeTask(currentSelectedTaskId)
                currentSelectedTaskId = null
                await renderTasks()
                form.reset()
            } catch (error) {
                console.error('Error deleting task :', error)
            }
        } else {
            console.error('No task selected');
        }
    })

    update.addEventListener('click', async () =>{
        if(currentSelectedTaskId){
            const taskData = {
                titlTask: form.elements['titlTask'].value,
                descriptionTask: form.elements['descriptionTask'].value
            };
    
            try {
                await updateTask(currentSelectedTaskId, taskData)
                currentSelectedTaskId = null
                await renderTasks()
                form.reset()
            } catch (error) {
                console.error('Error deleting task :', error)
            }
        } else {
            console.error('No task selected');
        }
    })

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
            form.reset()
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
