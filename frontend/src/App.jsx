import React, { useState } from 'react';
import TaskList from './TaskList';

function App() {
  const [task, setTask] = useState('');
  const [email, setEmail] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send task to the backend
    try {
      const response = await fetch('https://taskscheduler-5ij8.onrender.com/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task,
          email,
          schedule,
        }),
      });

      if (response.ok) {
        alert('Task added successfully');
        // setTask('');
        // setEmail('');
        // setSchedule('');
      } else {
        const errorText = await response.text();
        alert(`Error adding task: ${errorText}`);
      }
    } catch (error) {
      alert('Network error');
      console.error('Network error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Add New Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task:</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Schedule (Cron):</label>
          <input
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g., '0 */12 * * *' for every 12 hours"
            required
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
      <TaskList/>
    </div>
  );
}

export default App;
