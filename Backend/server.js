import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import { ROLES, ACCOUNT_STATUS } from './constants/roles.js';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Seed default admin account
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@bookadoctor.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
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
      console.log(`[Seeder] Default Admin account created: ${adminEmail}`);
    } else {
      console.log(`[Seeder] Admin account verified: ${adminEmail}`);
    }
  } catch (error) {
    console.error(`[Seeder Error] Admin seeding failed: ${error.message}`);
  }

  // Seed default doctors if they do not exist
  try {
    console.log('[Seeder] Verifying and seeding doctor profiles...');
    const defaultDoctors = [
      {
        name: "Dr. Alexander Bennett",
        email: "alexander@bookadoctor.com",
        specialization: "Cardiology",
        qualification: "MD, DM (Cardiology), FACC",
        experience: 14,
        hospital: "Metro Cardiac & Vascular Center",
        fee: 150,
        photo: "uploads/doctor1.jpg",
        about: "Dr. Alexander Bennett is an internationally recognized cardiologist with over 14 years of experience.",
        days: ["Monday", "Wednesday", "Friday"]
      },
      {
        name: "Dr. Sarah Jenkins",
        email: "sarah@bookadoctor.com",
        specialization: "Pediatrics",
        qualification: "MD (Pediatrics), DCH",
        experience: 10,
        hospital: "St. Jude Children's Hospital",
        fee: 90,
        photo: "uploads/doctor2.jpg",
        about: "Dr. Sarah Jenkins is a passionate pediatrician committed to child development and pediatric health.",
        days: ["Tuesday", "Thursday", "Saturday"]
      },
      {
        name: "Dr. Marcus Vance",
        email: "marcus@bookadoctor.com",
        specialization: "Neurology",
        qualification: "MD, PhD (Neurology)",
        experience: 18,
        hospital: "Brain & Spine Institute",
        fee: 180,
        photo: "uploads/doctor3.jpg",
        about: "Dr. Marcus Vance is a renowned neurologist and researcher specializing in neurodegenerative diseases.",
        days: ["Monday", "Tuesday", "Thursday"]
      },
      {
        name: "Dr. Olivia Rodriguez",
        email: "olivia@bookadoctor.com",
        specialization: "Dermatology",
        qualification: "MD (Dermatology), Board Certified",
        experience: 8,
        hospital: "Aura Skin & Aesthetic Clinic",
        fee: 100,
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
        about: "Dr. Olivia Rodriguez is a board-certified dermatologist specializing in medical, surgical, and cosmetic dermatology.",
        days: ["Wednesday", "Thursday", "Friday"]
      },
      {
        name: "Dr. Mahesh Reddy",
        email: "mahesh@bookadoctor.com",
        specialization: "General Medicine",
        qualification: "MBBS",
        experience: 10,
        hospital: "Reddy General Clinic",
        fee: 80,
        photo: "uploads/dr_mahesh_reddy.png",
        about: "Dr. Mahesh Reddy is an experienced general practitioner dedicated to offering comprehensive patient-focused primary health care services.",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      },
      {
        name: "Dr. Harris Valleru",
        email: "harris@bookadoctor.com",
        specialization: "Cardiology",
        qualification: "MBBS, MD (Cardiology)",
        experience: 8,
        hospital: "Valleru Heart Care",
        fee: 120,
        photo: "uploads/dr_harris_valleru.png",
        about: "Dr. Harris Valleru is a dedicated cardiologist specializing in non-invasive cardiology, heart health checkups, and cardiovascular disease prevention.",
        days: ["Monday", "Wednesday", "Thursday", "Friday"]
      },
      {
        name: "Dr. Rohan Gupta",
        email: "rohan@bookadoctor.com",
        specialization: "Pediatrics",
        qualification: "MD (Pediatrics)",
        experience: 7,
        hospital: "Gupta Kids Clinic",
        fee: 95,
        photo: "uploads/dr_rohan_gupta.png",
        about: "Dr. Rohan Gupta is a passionate young pediatrician focusing on child growth monitoring, vaccinations, and childhood illnesses.",
        days: ["Tuesday", "Thursday", "Saturday"]
      },
      {
        name: "Dr. Aisha Rahman",
        email: "aisha@bookadoctor.com",
        specialization: "Dermatology",
        qualification: "MD (Dermatology)",
        experience: 9,
        hospital: "Rahman Skin & Hair Clinic",
        fee: 110,
        photo: "uploads/dr_aisha_rahman.png",
        about: "Dr. Aisha Rahman specializes in clinical dermatology, skin care therapies, and medical aesthetics for all age groups.",
        days: ["Wednesday", "Friday", "Saturday"]
      },
      {
        name: "Dr. David Miller",
        email: "david@bookadoctor.com",
        specialization: "Orthopedics",
        qualification: "MS (Orthopedics)",
        experience: 15,
        hospital: "Miller Bone & Joint Care",
        fee: 140,
        photo: "uploads/dr_david_miller.png",
        about: "Dr. David Miller is an orthopedic surgeon specializing in joint replacement, sports injury recovery, and fracture care.",
        days: ["Monday", "Tuesday", "Thursday"]
      },
      {
        name: "Dr. Priya Nair",
        email: "priya@bookadoctor.com",
        specialization: "Psychiatry",
        qualification: "MD (Psychiatry)",
        experience: 11,
        hospital: "Nair Mind Care Center",
        fee: 130,
        photo: "uploads/dr_priya_nair.png",
        about: "Dr. Priya Nair provides compassionate psychological support, therapeutic sessions, and stress management coaching.",
        days: ["Tuesday", "Wednesday", "Friday"]
      }
    ];

    for (const docInfo of defaultDoctors) {
      let user = await User.findOne({ email: docInfo.email });
      if (!user) {
        user = new User({
          fullName: docInfo.name,
          email: docInfo.email,
          password: 'Password123!',
          phone: '+1000000000',
          gender: 'other',
          dob: new Date('1985-01-01'),
          address: {
            street: 'Clinic Street 1',
            city: 'TechCity',
            state: 'SiliconState',
            zipCode: '10101'
          },
          role: ROLES.DOCTOR,
          status: ACCOUNT_STATUS.ACTIVE,
          profileImage: docInfo.photo
        });
        await user.save();
      }

      let doctor = await Doctor.findOne({ user: user._id });
      if (!doctor) {
        doctor = new Doctor({
          user: user._id,
          qualification: docInfo.qualification,
          specialization: docInfo.specialization,
          experience: docInfo.experience,
          hospital: docInfo.hospital,
          consultationFee: docInfo.fee,
          about: docInfo.about,
          availableDays: docInfo.days,
          availableTime: { start: '09:00', end: '17:00' },
          rating: 4.8,
          approvalStatus: 'approved'
        });
        await doctor.save();
      }
    }
    console.log('[Seeder] All doctor profiles verified/seeded successfully!');
  } catch (error) {
    console.error(`[Seeder Error] Doctor seeding failed: ${error.message}`);
  }

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection Error] Shutting down...`);
    console.error(err.message || err);
    server.close(() => process.exit(1));
  });
};

startServer();
