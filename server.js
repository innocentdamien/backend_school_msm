const express = require('express');
const cors = require('cors');
const airtableAPI = require('./airtable');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Kisii School Backend API', status: 'running' });
});

// Teachers routes
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await airtableAPI.getTeachers();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teachers', async (req, res) => {
  try {
    const teacher = await airtableAPI.createTeacher(req.body);
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forms routes
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await airtableAPI.getForms();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/forms', async (req, res) => {
  try {
    const form = await airtableAPI.createForm(req.body);
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Case conferences routes
app.get('/api/case-conferences', async (req, res) => {
  try {
    const conferences = await airtableAPI.getCaseConferences();
    res.json(conferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/case-conferences', async (req, res) => {
  try {
    const conference = await airtableAPI.createCaseConference(req.body);
    res.json(conference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Guardians routes
app.get('/api/guardians', async (req, res) => {
  try {
    const guardians = await airtableAPI.getGuardians();
    res.json(guardians);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/guardians', async (req, res) => {
  try {
    const guardian = await airtableAPI.createGuardian(req.body);
    res.json(guardian);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Documents routes
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await airtableAPI.getDocuments();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const document = await airtableAPI.createDocument(req.body);
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin settings routes
app.get('/api/admin-settings', async (req, res) => {
  try {
    const settings = await airtableAPI.getAdminSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin-settings/:id', async (req, res) => {
  try {
    const setting = await airtableAPI.updateAdminSetting(req.params.id, req.body);
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await airtableAPI.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Students routes
app.get('/api/students', async (req, res) => {
  try {
    const students = await airtableAPI.getStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const student = await airtableAPI.createStudent(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await airtableAPI.authenticateUser(email, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials or inactive account' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});