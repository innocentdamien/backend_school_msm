require('dotenv').config();
const Airtable = require('airtable');

// Debug environment variables
console.log('Environment check:', {
  AIRTABLE_API_TOKEN: process.env.AIRTABLE_API_TOKEN ? 'SET' : 'MISSING',
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || 'MISSING',
  TEACHERS_TABLE_ID: process.env.TEACHERS_TABLE_ID || 'MISSING'
});

// Configure Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

// Table references with fallback
const tables = {
  teachers: base(process.env.TEACHERS_TABLE_ID || 'tblWPt0tiWwqA2dUW'),
  forms: base(process.env.FORMS_TABLE_ID || 'tbl79ZFvV9wxCNQkq'),
  caseConferences: base(process.env.CASE_CONFERENCES_TABLE_ID || 'tblRZd4Qil5VWcmio'),
  guardians: base(process.env.GUARDIANS_TABLE_ID || 'tbl0PVjfkbzORzsAt'),
  documentLibrary: base(process.env.DOCUMENT_LIBRARY_TABLE_ID || 'tblcFKmrD62a9Vl5r'),
  adminSettings: base(process.env.ADMIN_SETTINGS_TABLE_ID || 'tbl1VZTrlTmu4V7c7'),
  users: base(process.env.USERS_TABLE_ID || 'tblCbLEMflLMf1QiG'),
  students: base(process.env.STUDENTS_TABLE_ID || 'tblCHg6hnJ0oA0iUo')
};

// API functions
const airtableAPI = {
  // Teachers
  async getTeachers() {
    const records = await tables.teachers.select().all();
    return records.map(record => ({ id: record.id, ...record.fields }));
  },

  async createTeacher(data) {
    const record = await tables.teachers.create(data);
    return { id: record.id, ...record.fields };
  },

  // Forms
  async getForms() {
    try {
      const records = await tables.forms.select().all();
      if (records.length > 0) {
        console.log('Forms table fields:', Object.keys(records[0].fields));
      }
      return records.map(record => ({ id: record.id, ...record.fields }));
    } catch (error) {
      console.error('Get forms error:', error.message);
      return [];
    }
  },

  async createForm(data) {
    try {
      console.log('Creating form with data:', data);
      
      // Get available fields first
      const allForms = await tables.forms.select().all();
      if (allForms.length > 0) {
        const availableFields = Object.keys(allForms[0].fields);
        console.log('Available form fields:', availableFields);
        
        // Filter data to only include existing fields
        const filteredData = {};
        availableFields.forEach(field => {
          if (data[field] !== undefined) {
            filteredData[field] = data[field];
          }
        });
        
        console.log('Filtered data for creation:', filteredData);
        const record = await tables.forms.create(filteredData);
        console.log('Form created successfully:', record.id);
        return { id: record.id, ...record.fields };
      } else {
        // If no forms exist, create with provided data
        const record = await tables.forms.create(data);
        console.log('Form created successfully:', record.id);
        return { id: record.id, ...record.fields };
      }
    } catch (error) {
      console.error('Create form error:', error.message);
      console.error('Error details:', error);
      throw error;
    }
  },

  // Case Conferences
  async getCaseConferences() {
    const records = await tables.caseConferences.select().all();
    return records.map(record => ({ id: record.id, ...record.fields }));
  },

  async createCaseConference(data) {
    const record = await tables.caseConferences.create(data);
    return { id: record.id, ...record.fields };
  },

  // Guardians
  async getGuardians() {
    const records = await tables.guardians.select().all();
    return records.map(record => ({ id: record.id, ...record.fields }));
  },

  async createGuardian(data) {
    const record = await tables.guardians.create(data);
    return { id: record.id, ...record.fields };
  },

  // Document Library
  async getDocuments() {
    const records = await tables.documentLibrary.select().all();
    return records.map(record => ({ id: record.id, ...record.fields }));
  },

  async createDocument(data) {
    const record = await tables.documentLibrary.create(data);
    return { id: record.id, ...record.fields };
  },

  // Admin Settings
  async getAdminSettings() {
    const records = await tables.adminSettings.select().all();
    return records.map(record => ({ id: record.id, ...record.fields }));
  },

  async updateAdminSetting(id, data) {
    const record = await tables.adminSettings.update(id, data);
    return { id: record.id, ...record.fields };
  },

  // Users/Authentication
  async authenticateUser(email, password) {
    try {
      const records = await tables.users.select({
        filterByFormula: `AND({Email} = '${email}', {Password Hash} = '${password}', {Status} = 'Active')`
      }).all();
      return records.length > 0 ? { id: records[0].id, ...records[0].fields } : null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  },

  async getUsers() {
    const records = await tables.users.select().all();
    return records.map(record => ({ id: record.id, ...record.fields }));
  },

  // Students
  async getStudents() {
    try {
      const records = await tables.students.select().all();
      return records.map(record => ({ id: record.id, ...record.fields }));
    } catch (error) {
      console.error('Students table error:', error.message);
      return [];
    }
  },

  async createStudent(data) {
    try {
      console.log('Creating student with data:', data);
      const record = await tables.students.create(data);
      console.log('Student created successfully:', record.id);
      return { id: record.id, ...record.fields };
    } catch (error) {
      console.error('Create student error:', error.message);
      console.error('Error details:', error);
      throw error;
    }
  }
}
;

module.exports = airtableAPI;