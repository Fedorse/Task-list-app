import { creatTask, removeTask, updateTask, getTasks } from '/api/tasksApi.js';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.add-task');
    const list = document.querySelector('.list')
    const remove = document.querySelector('.deleteBtn')
    const update = document.querySelector('.updateTask')
    const appTitleElement = document.querySelector('.app-title');

    const titleInput = form.elements['titlTask'];
    const descriptionInput = form.elements['descriptionTask'];
    
    let currentSelectedTaskId = null;

    const updateAppTitle = () => {
        appTitleElement.innerHTML = titleInput.value;
    };

    titleInput.addEventListener('input', updateAppTitle);


    const handleTaskItemClick = (event) => {
            const item = event.target.closest('.task');
            if (item) {
        document.querySelectorAll('.task').forEach(task => {
            task.classList.remove('selected');
        });

        item.classList.add('selected');

                const { title, description, id: taskId } = item.dataset;
                currentSelectedTaskId = taskId; 
                titleInput.value = title;
                descriptionInput.value = description;
                appTitleElement.textContent = title;

            }
    };


    const addClickHandlerToListItems = () => {
        list.addEventListener('click', handleTaskItemClick);
    };

    const renderTasks = async () => {
        const tasks = await getTasks()
        const tasksHtml = tasks.map(task => 
            `<li class="task" 
                data-id="${task._id}"
                data-title="${task.titlTask}" 
                data-description="${task.descriptionTask}">
                <h3 class="task-title">${task.titlTask}</h3>
            </li>`
        ).join('');

        document.querySelector('.list').innerHTML = tasksHtml;
        addClickHandlerToListItems()
    }

    const resetAndRenderTasks = async () => {
        currentSelectedTaskId = null;
        await renderTasks();
        form.reset();
    };

    remove.addEventListener('click', async () =>{
        if( currentSelectedTaskId ){
            try {
                await removeTask(currentSelectedTaskId)
                resetAndRenderTasks()
            } catch (error) {
                console.error('Error deleting task :', error)
            }
        } else {
            console.error('No task selected');
        }
    })


    update.addEventListener('click', async () =>{
        if( currentSelectedTaskId ){
            const taskData = {
                titlTask: titleInput.value,
                descriptionTask: descriptionInput.value
            };
    
            try {
                await updateTask(currentSelectedTaskId, taskData)
                resetAndRenderTasks()
            } catch (error) {
                console.error('Error deleting task :', error)
            }
        } else {
            console.error('No task selected');
        }
    })

    const formDataToJson = formData => JSON.stringify(Object.fromEntries(formData))
    const isValidFormData = formData => formData.get('titlTask') && formData.get('descriptionTask');

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
    })
    
    renderTasks()
})
