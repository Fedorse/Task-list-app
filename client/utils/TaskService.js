export const  handleRemoveTask = async () =>{
    if( currentSelectedTaskId ) {
        try {
            await removeTask(currentSelectedTaskId)
            resetAndRenderTasks()
        } catch (error) {
            console.error('Error deleting task :', error)
        }
    } else {
        console.error('No task selected');
    }
}


export const handlUpdateTask = async () =>{
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
}
