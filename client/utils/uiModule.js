

export const addClickHandlerToListItems = (listTask) => {
    listTask.addEventListener('click', handleTaskItemClick);
};
export const taskTemplate = (task) => {
    return `
        <li class="task" 
            data-id="${task._id}"
            data-title="${task.titlTask}" 
            data-description="${task.descriptionTask}">
            <h3 class="task-title">${task.titlTask}</h3>
        </li>`;
};

export const renderTasks = async () => {
    const tasks = await getTasks()
    console.log(tasks)
    const tasksHtml = tasks.map(taskTemplate).join('');
    document.querySelector('.list-task').innerHTML = tasksHtml;
    addClickHandlerToListItems()
    
}

// export const resetAndRenderTasks = async () => {
//     currentSelectedTaskId = null;
//     await renderTasks();
//     form.reset();
// };




// export const handleTaskItemClick = (event, currentSelectedElement, titleInput, descriptionInput, appTitleElement) => {
//     const item = event.target.closest('.task');
//     if (item) {
//         if(currentSelectedElement){
//             currentSelectedElement.classList.remove('selected')
//         }

// item.classList.add('selected');
// currentSelectedElement = item;


//         const { title, description, id: taskId } = item.dataset;
//         currentSelectedTaskId = taskId; 
//         titleInput.value = title;
//         descriptionInput.value = description;
//         appTitleElement.textContent = title;

//     }
// };

// export const updateAppTitle = (appTitleElement) => {
//     appTitleElement.innerHTML = titleInput.value;

// };

// const addClickHandlerToListItems = () => {
//     listTask.addEventListener('click', handleTaskItemClick);

// };
