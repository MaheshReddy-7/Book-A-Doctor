import dotenv from 'dotenv';
dotenv.config();

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';
import { ROLES, ACCOUNT_STATUS } from '../constants/roles.js';

// Import verification tests
const BASE_URL = 'http://127.0.0.1:5000/api';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runVerification() {
  console.log('[Verify Server] Starting in-memory MongoDB server...');
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  console.log(`[Verify Server] In-memory MongoDB URI: ${mongoUri}`);

  // Override environment variables
  process.env.MONGO_URI = mongoUri;
  process.env.PORT = '5000';
  process.env.NODE_ENV = 'development';

  // Connect Mongoose to the memory server
  console.log('[Verify Server] Connecting Mongoose to in-memory DB...');
  await mongoose.connect(mongoUri);
  console.log('[Verify Server] Database connected successfully!');

  // Seed Admin user
  const adminEmail = 'admin@bookadoctor.com';
  const adminPassword = 'Admin123!';
  const admin = new User({
    fullName: 'System Administrator',
    email: adminEmail,
    password: adminPassword,
    phone: '+1000000000',
    gender: 'other',
    dob: new Date('1990-01-01'),
    address: {
      street: 'Admin HQ Street 1',
      city: 'TechCity',
      state: 'SiliconState',
      zipCode: '10101'
    },
    role: ROLES.ADMIN,
    status: ACCOUNT_STATUS.ACTIVE
  });
  await admin.save();
  console.log('[Verify Server] Seeded default administrator account.');

  // Start Express server
  console.log('[Verify Server] Starting Express application...');
  const server = app.listen(5000, async () => {
    console.log('[Verify Server] Server is listening on http://127.0.0.1:5000');
    
    // Now trigger the verification tests
    try {
      await runTests();
    } catch (testError) {
      console.error('❌ Integration Verification Failed with exception:', testError);
    } finally {
      // Tear down everything
      console.log('\n[Verify Server] Tearing down test resources...');
      server.close();
      await mongoose.disconnect();
      await mongoServer.stop();
      console.log('[Verify Server] Cleanup completed. Exiting.');
      process.exit(0);
    }
  });
}

async function runTests() {
  console.log('\n================================================');
  console.log('       STARTING REST API LIFECYCLE TESTS');
  console.log('================================================\n');

  const testEmailPatient = `patient-${Date.now()}@test.com`;
  const testEmailDoctor = `doctor-${Date.now()}@test.com`;
  const testPassword = 'Password123!';

  let patientToken = '';
  let doctorToken = '';
  let adminToken = '';
  
  let doctorId = '';
  let appointmentId = '';

  // 1. Log in as Seeded Administrator
  try {
    console.log('[Test 1] Logging in as Seeded Administrator...');
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bookadoctor.com',
        password: 'Admin123!'
      })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Login failed');
    adminToken = json.data.token;
    console.log('✔ Administrator Logged In successfully!');
  } catch (err) {
    console.error('❌ Test 1 Failed:', err.message);
    throw err;
  }

  // 2. Register a Patient
  try {
    console.log('\n[Test 2] Registering a Patient...');
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: testEmailPatient,
        password: testPassword,
        phone: '+1234567890',
        gender: 'female',
        dob: '1995-05-15',
        address: {
          street: '123 Patient Lane',
          city: 'CareCity',
          state: 'HealthState',
          zipCode: '12345'
        },
        role: 'patient'
      })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Registration failed');
    patientToken = json.data.token;
    console.log('✔ Patient Registered successfully! Email:', testEmailPatient);
  } catch (err) {
    console.error('❌ Test 2 Failed:', err.message);
    throw err;
  }

  // 3. Register a Doctor
  try {
    console.log('\n[Test 3] Registering a Doctor (Pending Approval)...');
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Dr. John Smith',
        email: testEmailDoctor,
        password: testPassword,
        phone: '+1987654321',
        gender: 'male',
        dob: '1980-08-20',
        address: {
          street: '456 Clinic Blvd',
          city: 'MedTown',
          state: 'ClinicState',
          zipCode: '67890'
        },
        role: 'doctor',
        qualification: 'M.D., Cardiology',
        specialization: 'Cardiology',
        experience: 12,
        hospital: 'City Heart Hospital',
        consultationFee: 150
      })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Registration failed');
    doctorToken = json.data.token;
    console.log('✔ Doctor Registered successfully! Email:', testEmailDoctor);
  } catch (err) {
    console.error('❌ Test 3 Failed:', err.message);
    throw err;
  }

  // 4. Admin fetch Pending Doctors list
  try {
    console.log('\n[Test 4] Admin listing Pending Doctors...');
    const res = await fetch(`${BASE_URL}/admin/doctors/pending`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to list pending doctors');
    
    const matchingDoc = json.data.find(d => d.user.email === testEmailDoctor);
    if (!matchingDoc) throw new Error('Registered doctor not found in pending list');
    
    doctorId = matchingDoc._id;
    console.log(`✔ Admin fetched pending list. Found Doctor ID: ${doctorId}`);
  } catch (err) {
    console.error('❌ Test 4 Failed:', err.message);
    throw err;
  }

  // 5. Admin Approve Doctor
  try {
    console.log('\n[Test 5] Admin approving the Doctor...');
    const res = await fetch(`${BASE_URL}/admin/doctors/${doctorId}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Approval failed');
    console.log('✔ Doctor approved successfully!');
  } catch (err) {
    console.error('❌ Test 5 Failed:', err.message);
    throw err;
  }

  // 6. Public Search Approved Doctors
  try {
    console.log('\n[Test 6] Patient searching approved Cardiology doctors...');
    const res = await fetch(`${BASE_URL}/doctors?specialization=Cardiology`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Doctor search failed');
    if (json.data.doctors.length === 0) throw new Error('No cardiology doctors found');
    console.log(`✔ Found ${json.data.doctors.length} cardiologist(s). First doctor name: ${json.data.doctors[0].user.fullName}`);
  } catch (err) {
    console.error('❌ Test 6 Failed:', err.message);
    throw err;
  }

  // 7. Patient Books Appointment
  try {
    console.log('\n[Test 7] Patient booking appointment with approved Doctor...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${patientToken}`
      },
      body: JSON.stringify({
        doctor: doctorId,
        date: dateStr,
        time: '10:30',
        symptoms: 'Mild chest pain and shortness of breath',
        notes: 'Please review recent cardiac history.'
      })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Booking failed');
    appointmentId = json.data._id;
    console.log(`✔ Appointment booked successfully! ID: ${appointmentId}`);
  } catch (err) {
    console.error('❌ Test 7 Failed:', err.message);
    throw err;
  }

  // 8. Doctor list appointments and Accept appointment
  try {
    console.log('\n[Test 8] Doctor listing appointments and accepting the scheduled slot...');
    const resList = await fetch(`${BASE_URL}/appointments`, {
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    const jsonList = await resList.json();
    if (!resList.ok || !jsonList.success) throw new Error(jsonList.message || 'Listing failed');
    console.log(`✔ Doctor has ${jsonList.data.appointments.length} appointment(s).`);

    const resAccept = await fetch(`${BASE_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${doctorToken}`
      },
      body: JSON.stringify({ status: 'accepted' })
    });
    const jsonAccept = await resAccept.json();
    if (!resAccept.ok || !jsonAccept.success) throw new Error(jsonAccept.message || 'Acceptance failed');
    console.log('✔ Doctor accepted the appointment successfully!');
  } catch (err) {
    console.error('❌ Test 8 Failed:', err.message);
    throw err;
  }

  // 9. Fetch Notifications
  try {
    console.log('\n[Test 9] Patient checking notification list for status update...');
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Notifications fetch failed');
    console.log(`✔ Patient has ${json.data.length} notification(s).`);
    json.data.slice(0, 2).forEach((n, idx) => {
      console.log(`  [Notification #${idx + 1}] Title: "${n.title}" | Msg: "${n.message}"`);
    });
  } catch (err) {
    console.error('❌ Test 9 Failed:', err.message);
    throw err;
  }

  // 10. Admin Dashboard Statistics
  try {
    console.log('\n[Test 10] Admin loading Dashboard Analytics...');
    const res = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Stats loading failed');
    console.log('✔ Dashboard Stats fetched successfully:');
    console.log(JSON.stringify(json.data, null, 2));
  } catch (err) {
    console.error('❌ Test 10 Failed:', err.message);
    throw err;
  }

  console.log('\n================================================');
  console.log('       ALL REST API INTEGRATION TESTS PASSED');
  console.log('================================================\n');
}

runVerification();
