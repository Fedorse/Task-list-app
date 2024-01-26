import { creatTask, removeTask, updateTask, getTasks } from '/api/tasksApi.js';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.app__task-form');
    const titleInput = form.elements['titlTask'];
    const descriptionInput = form.elements['descriptionTask'];
    const listTask = document.querySelector('.app__task-list')
    const removeButton = document.querySelector('.app__task-form-delete')
    const arhiveButton = document.querySelector('.app__task-form-archive')
    const appTitleElement = document.querySelector('.app__title');
    const themeToggle = document.querySelector('.app__theme-button');

    let currentSelectedTaskId = null;
    let currentSelectedElement = null;

    document.body.classList.add('dark-theme');

    themeToggle.addEventListener('click', function() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
});

    
    const updateAppTitle = () => appTitleElement.textContent = titleInput.value;
    titleInput.addEventListener('input', updateAppTitle);
    

    const selectTaskItem = (item) => {
            if ( currentSelectedElement ) {
                currentSelectedElement.classList.remove('app__task-list-item--selected')
            }
            item.classList.add('app__task-list-item--selected');
            currentSelectedElement = item;
    } 


    const handleTaskItemClick = (event) => {
            const item = event.target.closest('.app__task-list-item');
            clearValidation()
            if (!item) return

            selectTaskItem(item)


            const { title, description, id: taskId } = item.dataset;
            currentSelectedTaskId = taskId; 

            if (taskId === 'new-task') {
                titleInput.value = 'New task';
                descriptionInput.value = '';
                appTitleElement.textContent = 'New task';


            } else {
                titleInput.value = title;
                descriptionInput.value = description;
                appTitleElement.textContent = title;

            }
            const isCompleted = item.classList.contains('app__task-list-item--completed');
            arhiveButton.textContent = isCompleted ? 'Unarhive' : 'Arhive';
     }
            listTask.addEventListener('click', handleTaskItemClick);


    const taskTemplate = (task) => {
        return `
             <li class="app__task-list-item" 
                data-id="${task._id}"
                data-title="${task.titlTask}" 
                data-description="${task.descriptionTask}">
                <h3 class="app__task-list-item-title">${task.titlTask}</h3>
            </li>`;
    };


    const startOfDay = (date) => {
        const newDate = new Date(date)
        newDate.setHours(0, 0, 0, 0)
        return newDate
    }

    const getYesterday = () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate()-1 )
        return startOfDay(yesterday)
    }

    const getThirtyDaysAgo = () =>{
        const thirtyDays = new Date()
        thirtyDays.setDate(thirtyDays.getDate()-30 )
        return startOfDay(thirtyDays)
    }



    const filterTasksByDate = (tasks, date) =>{
        return tasks.filter(task => {
            const taskDate = new Date(task.date)
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.toDateString() === date.toDateString()
        })
    }

    const generateTaskHtml = (tasks, title) => {
        if (tasks.length > 0) {
            return `<h1 class ='app__task-title-date'>${title}</h1>` + tasks.map(taskTemplate).join('')
        }
        return ''
    }

    

    const renderTasks = async () => {
        try {
            let tasks = await getTasks();

            const today = startOfDay(new Date())
            const yestrday = getYesterday()
            const thirtyDays = getThirtyDaysAgo()
    
            const tasksToday = filterTasksByDate(tasks, today)
            const taskYestrday = filterTasksByDate(tasks, yestrday)
            const tasksLast30Days = tasks.filter(task => {
                const taskDate = new Date(task.date);
                return taskDate.getTime() < yestrday.getTime() && taskDate.getTime() >= thirtyDays.getTime();
            });
            
            let tasksHtml = taskTemplate({ _id: 'new-task', titlTask: "New Task", descriptionTask: "" }); 
            tasksHtml += generateTaskHtml(tasksToday, 'Today')
            tasksHtml += generateTaskHtml(taskYestrday, 'Yesterday')
            tasksHtml += generateTaskHtml(tasksLast30Days, '30 Day Ago')
 
            listTask.innerHTML = tasksHtml;

            const newTaskElement = listTask.querySelector(`[data-id="new-task"]`);
            if (newTaskElement) {
             newTaskElement.click(); 
              }
    
            document.querySelectorAll('.app__task-list-item').forEach(task => {
                const taskId = task.dataset.id;
                if (localStorage.getItem(taskId) === 'completed') {
                    task.classList.add('app__task-list-item--completed');
                    if (taskId === currentSelectedTaskId) {
                        arhiveButton.textContent = 'Unarhive';
                    }
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

    const handleArhiveTask = () => {
            if (currentSelectedTaskId === 'new-task') {
                return;
        }

        const selectedTaskElement = document.querySelector(`.app__task-list-item[data-id="${currentSelectedTaskId}"]`);
            selectedTaskElement.classList.toggle('app__task-list-item--completed');

        const wasArchived = selectedTaskElement.classList.contains('app__task-list-item--completed')
            localStorage.setItem(currentSelectedTaskId, wasArchived ? 'completed' : '');
            arhiveButton.textContent = wasArchived ? 'Unarhive' : 'Arhive'

        showToast(wasArchived ? 'Task archived' : 'Task unarchived')

    }


    removeButton.addEventListener('click',handleRemoveTask)
    arhiveButton.addEventListener('click',handleArhiveTask)


    const formDataToJson = formData => JSON.stringify(Object.fromEntries(formData))

    const clearValidation = () => {
        document.querySelectorAll('.invalid-input').forEach(element => {
            element.classList.remove('invalid-input');
        });
    };

    const inputsRemoveTarget = document.querySelectorAll('.app__task-title-input, .app__task-description-textarea');
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
