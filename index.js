const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection and models
mongoose.connect('mongodb+srv://ashpatni:5eoZl3tEIhZSbB1F@cluster0.nx21r.mongodb.net/mydatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("DB connected successfully"))
.catch((err) => console.log("DB connection error:", err));

const emailLogSchema = new mongoose.Schema({
  email: String,
  task: String,
  schedule: String,
  sentAt: { type: Date, default: Date.now },
});
const EmailLog = mongoose.model('EmailLog', emailLogSchema);

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'patniaishwarya96@gmail.com',
    pass: 'gcvc syov wida xqxb',
  },
});

// POST route to add a new task
app.post('/api/tasks', (req, res) => {
  const { task, email, schedule } = req.body;

  // Debugging: Log the task details
  console.log('Received task:', { task, email, schedule });

  // Schedule the task using cron
  const scheduledTask = cron.schedule(schedule, () => {
    const mailOptions = {
      from: 'aishwaryapatni96@gmail.com',
      to: email,
      subject: `Scheduled Task: ${task}`,
      text: `This is your scheduled task: ${task}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return;
      }

      // Log the task execution in MongoDB
      const emailLog = new EmailLog({ task, email, schedule });
      emailLog.save()
        .then(() => console.log('Task executed and logged'))
        .catch(err => console.log('Error logging task:', err));

      console.log('Email sent:', info.response);
    });
  });

  // Debugging: Log scheduled task
  console.log('Task scheduled with cron expression:', schedule);

  res.status(200).send('Task added and scheduled successfully');
});

// GET route to fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await EmailLog.find(); // Fetch all tasks from MongoDB
    res.status(200).json(tasks); // Send the tasks as a JSON response
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Error fetching tasks');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
