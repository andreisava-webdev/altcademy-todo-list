var appendTask = function (task) {
  $('.tasks tbody').append(`
    <tr>
        <td>${task.content}</td>
        <td>${task.due}</td>
        <td>
            <button class="btn btn-danger btn-sm">Delete</button>
            <button class="btn btn-success btn-sm">Mark completed</button>
        </td>
    </tr>
`);
};

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
    error: function (request, textStatus, errorMessage) {},
  });
};

var addTask = function (task) {
  $.ajax({
    type: 'POST',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=132',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        content: task.content,
        due: task.dueDate,
      },
    }),
    success: function (response, textStatus) {
      var task = response.task;
      appendTask(task);
    },
    error: function (request, textStatus, errorMessage) {},
  });
};

getAllTasks();

$('#addTask').on('submit', function (event) {
  event.preventDefault();
  var taskContent = $(this).find('[name=taskContentInput]').val();
  var dueDate = $(this).find('[name=dueDateInput]').val();

  var task = {
    content: taskContent,
    due: dueDate,
  };

  addTask(task);
});
