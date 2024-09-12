import React, { useEffect, useState } from 'react';
// import './TaskList.css'; // Import the CSS file

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://taskscheduler-5ij8.onrender.com/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Error fetching tasks');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="task-list">
      <h2>Scheduled Tasks</h2>
      {tasks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Email</th>
              <th>Schedule</th>
              <th>Sent At</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.task}</td>
                <td>{task.email}</td>
                <td>{task.schedule}</td>
                <td>{new Date(task.sentAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks scheduled.</p>
      )}
    </div>
  );
}

export default TaskList;
