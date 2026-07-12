import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.js';
import Doctor from './models/Doctor.js';

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected!');
    const usersCount = await User.countDocuments();
    const doctorsCount = await Doctor.countDocuments();
    console.log('Total Users:', usersCount);
    console.log('Total Doctors:', doctorsCount);
    
    const doctorsList = await Doctor.find().populate('user');
    doctorsList.forEach(doc => {
      console.log(`Doctor: ${doc.user?.fullName} | Specialization: ${doc.specialization} | Status: ${doc.approvalStatus}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkDB();
