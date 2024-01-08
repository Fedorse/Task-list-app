import { addTasksInlist } from '/api/tasksApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-task');
    const list = document.querySelector('.list')

        const displayingTasks = () => {
            fetch('/api/taskLists')
                .then(response => response.json())
                .then(tasks => { const taskListHTML = tasks.map(task => `<li data-title="${task.titlTask}" data-description="${task.descriptionTask}">
                ${task.titlTask}: ${task.descriptionTask}
            </li>`).join('');
                list.innerHTML = `<ul>${taskListHTML}</ul>`;
                // Добавляем обработчики событий для каждой задачи
            document.querySelectorAll('.list li').forEach(item => {
                item.addEventListener('click', () => {
                    // Заполняем форму данными задачи
                    form.elements['titlTask'].value = item.getAttribute('data-title');
                    form.elements['descriptionTask'].value = item.getAttribute('data-description');
                });
            });
            })

                .catch(error => console.error('Error:', error));
        };

        displayingTasks()

    const formDataToJson = formData => JSON.stringify(Object.fromEntries(formData))

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

            // Пример простой валидации
    if (!formData.get('titlTask') || !formData.get('descriptionTask')) {
        console.error('All fields are required');
        return; // Прекращаем выполнение функции
    }
        const data = formDataToJson(formData)

        addTasksInlist(data, displayingTasks)



    });
});
