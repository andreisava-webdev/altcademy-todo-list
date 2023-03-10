// Helper function to append task to tasks table
var appendTask = function (task) {
  const status = task.completed ? 'Completed' : 'Incomplete';
  const dueDate = new Date(task.due).toLocaleString();
  const updateButtonText = task.completed ? 'Reopen' : 'Mark completed';
  $('.tasks tbody').append(`
    <tr data-id=${task.id}>
        <td class="taskContent">${task.content}</td>
        <td class="taskDueDate">${dueDate}</td>
        <td class="taskStatus">${status}</td>
        <td>
            <button class="btn btn-danger btn-sm remove-btn">Delete</button>
            <button class="btn btn-success btn-sm update-btn">${updateButtonText}</button>
        </td>
    </tr>
`);

  $(`[data-id=${task.id}]`)
    .find('.update-btn')
    .on('click', function () {
      updateTaskStatus(task.id);
    });

  $(`[data-id=${task.id}]`)
    .find('.remove-btn')
    .on('click', function () {
      deleteTask(task.id);
    });
};

// Request to get all tasks from API
var getAllTasks = function () {
  $.ajax({
    type: 'GET',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=132',
    dataType: 'json',
    success: function (response, textStatus) {
      var tasks = response.tasks;

      if (tasks.length === 0) {
        $('.tasks').append(
          '<p class="col-6 mx-auto text-center">You have no tasks!</p>'
        );
      }

      tasks.forEach(function (task) {
        appendTask(task);
      });
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
};

// Request to add new task
var addTask = function (task) {
  $.ajax({
    type: 'POST',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=132',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        content: task.content,
        due: task.due,
      },
    }),
    success: function (response, textStatus) {
      var task = response.task;
      appendTask(task);
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
};

// Request to update task status
var updateTaskStatus = function (id) {
  var currentStatus =
    $(`[data-id=${id}]`).children('.taskStatus').text() === 'Completed'
      ? true
      : false;

  $.ajax({
    type: 'PUT',
    url: !currentStatus
      ? `https://fewd-todolist-api.onrender.com/tasks/${id}/mark_complete?api_key=132`
      : `https://fewd-todolist-api.onrender.com/tasks/${id}/mark_active?api_key=132`,
    contentType: 'application/json',
    success: function (response, textStatus) {
      console.log(response);
      var updatedTask = response.task;
      var updatedStatus = updatedTask.completed ? 'Completed' : 'Incomplete';
      var updatedButtonText = updatedTask.completed
        ? 'Reopen'
        : 'Mark completed';
      $(`[data-id=${id}]`).children('.taskStatus').html(updatedStatus);
      $(`[data-id=${id}]`).find('.update-btn').html(updatedButtonText);
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
};

// Request to delete task
var deleteTask = function (id) {
  var confirm = window.confirm('Are you sure you want to delete this task?');

  if (!confirm) return;
  $.ajax({
    type: 'DELETE',
    url: `https://fewd-todolist-api.onrender.com/tasks/${id}?api_key=132`,
    success: function (response, textStatus) {
      $(`[data-id=${id}]`).remove();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
};

// Handler for new task form
$('#addTask').on('submit', function (event) {
  event.preventDefault();
  var taskContent = $(this).find('[name=taskContentInput]').val();
  var dueDate = $(this).find('[name=dueDateInput]').val();

  var task = {
    content: taskContent,
    due: dueDate,
  };

  console.log(task);

  addTask(task);
});

getAllTasks();
