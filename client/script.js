import { creatTask, removeTask, updateTask, getTasks } from '/api/tasksApi.js';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.form-task');
    const listTask = document.querySelector('.list-task')
    const removeButton = document.querySelector('.deleteBtn')
    const updateButton = document.querySelector('.updateTask')
    const appTitleElement = document.querySelector('.app-title');
    const titleInput = form.elements['titlTask'];
    const descriptionInput = form.elements['descriptionTask'];


    let currentSelectedTaskId = null;
    let currentSelectedElement = null;

    
    const updateAppTitle = () => appTitleElement.textContent = titleInput.value;
    titleInput.addEventListener('input', updateAppTitle);
    

    const selectTaskItem = (item) => {
            if ( currentSelectedElement ) {
                currentSelectedElement.classList.remove('selected')
            }
            item.classList.add('selected');
            currentSelectedElement = item;
    } 


    const handleTaskItemClick = (event) => {
            const item = event.target.closest('.task');
            clearValidation()
            if (!item) return

            selectTaskItem(item)

            const { title, description, id: taskId } = item.dataset;
            currentSelectedTaskId = taskId; 

            if (taskId === 'new-task') {
                titleInput.value = 'New task';
                descriptionInput.value = '';
                appTitleElement.textContent = 'New task';
                item.style.backgroundImage = 'none';

            } else {
                titleInput.value = title;
                descriptionInput.value = description;
                appTitleElement.textContent = title;
            }
     }
            listTask.addEventListener('click', handleTaskItemClick);


    const taskTemplate = (task) => {
        return `
            <li class="task" 
                data-id="${task._id}"
                data-title="${task.titlTask}" 
                data-description="${task.descriptionTask}">
                <h3 class="task-title">${task.titlTask}</h3>
            </li>`;
    };


    const renderTasks = async () => {
        try {
            let tasks = await getTasks()

            const newTask = { _id: 'new-task', titlTask: "New Task", descriptionTask: "" };
            tasks = [newTask, ...tasks];

            const tasksHtml = tasks.map(taskTemplate).join('');
            listTask.innerHTML = tasksHtml;

            const newTaskElement = listTask.querySelector(`[data-id="${newTask._id}"]`);
            if (newTaskElement) {
            newTaskElement.click(); 
        }

        document.querySelectorAll('.task').forEach(task => {
            const taskId = task.dataset.id;
            if (localStorage.getItem(taskId) === 'completed') {
                task.classList.add('completed-task');
            }
        });
    
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }


    const resetAndRenderTasks = async () => {
        currentSelectedTaskId = null;
        await renderTasks();
        form.reset();
    };

    const showToast = (message) => {
        let toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    };

    const  handleRemoveTask = async () => {
        if (currentSelectedTaskId === 'new-task') {
            return;
        }
            if (currentSelectedTaskId) {
                try {
                    await removeTask(currentSelectedTaskId)
                    showToast('Task remove')
                    resetAndRenderTasks()
                } catch (error) {
                    console.error('Error deleting task :', error)
                }
        }
    }


        const handlUpdateTask = () => {

            if (currentSelectedTaskId === 'new-task') {
                return;
            }

            const selectedTaskElement = document.querySelector(`.task[data-id="${currentSelectedTaskId}"]`);
            if (currentSelectedTaskId) {
                selectedTaskElement.classList.toggle('completed-task');
                showToast('Task arhive')
                localStorage.setItem(currentSelectedTaskId, 'completed');

                // resetAndRenderTasks()

                // const taskData = {
                //     titlTask: titleInput.value,
                //     descriptionTask: descriptionInput.value
                // };
        
                // try {
                //     await updateTask(currentSelectedTaskId, taskData)
                //     showToast()
                //     resetAndRenderTasks()
                // } catch (error) {
                //     console.error('Error deleting task :', error)
                // }
            // } else {
            //     console.error('No task selected');
            }
        }


    removeButton.addEventListener('click',handleRemoveTask)
    updateButton.addEventListener('click',handlUpdateTask)


    const formDataToJson = formData => JSON.stringify(Object.fromEntries(formData))

    const clearValidation = () => {
        document.querySelectorAll('.invalid-input').forEach(element => {
            element.classList.remove('invalid-input');
        });
    };

    const inputsRemoveTarget = document.querySelectorAll('.title-inp, .area-inp');
    inputsRemoveTarget.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('invalid-input');
        });
    });

    const isValidFormData = formData => {
        let isValid = true
        if(!formData.get('titlTask')){
            titleInput.classList.add('invalid-input')
            isValid = false
        } else {
        titleInput.classList.remove('invalid-input')
        }
        if(!formData.get('descriptionTask')){
            descriptionInput.classList.add('invalid-input')
            isValid = false
        } else {
        descriptionInput.classList.remove('invalid-input')
        }
        return isValid;
    }

    
    const handleSubmit = async (formData) => {
        if (!isValidFormData(formData)) {
            return 
        }

        try {
            const data = formDataToJson(formData);
            await creatTask(data);
            showToast('Task save')
            resetAndRenderTasks()
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
