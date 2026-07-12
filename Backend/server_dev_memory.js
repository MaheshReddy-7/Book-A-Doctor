import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from './app.js';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import { ROLES, ACCOUNT_STATUS } from './constants/roles.js';

const start = async () => {
  console.log('[Dev DB] Starting in-memory MongoDB server...');
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log(`[Dev DB] In-memory MongoDB URI: ${mongoUri}`);

    process.env.MONGO_URI = mongoUri;

    await mongoose.connect(mongoUri);
    console.log(`[Dev DB] MongoDB Connected successfully to in-memory database.`);

    // Seed default admin account
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

    // Seed default doctors if they do not exist
    try {
      console.log('[Seeder] Verifying and seeding doctor profiles in-memory...');
      const defaultDoctors = [
        {
          name: "Dr. Alexander Bennett",
          email: "alexander@bookadoctor.com",
          specialization: "Cardiology",
          qualification: "MD, DM (Cardiology), FACC",
          experience: 14,
          hospital: "Metro Cardiac & Vascular Center",
          fee: 150,
          photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
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
          photo: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300",
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
          photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
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
          photo: "https://images.unsplash.com/photo-1582750433449-64c656fb19f0?auto=format&fit=crop&q=80&w=300&h=300",
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
          photo: "https://images.unsplash.com/photo-1625019030820-e4ed970a6c95?auto=format&fit=crop&q=80&w=300&h=300",
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
          photo: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&q=80&w=300&h=300",
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
          photo: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300",
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
          photo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=300&h=300",
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
          photo: "https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?auto=format&fit=crop&q=80&w=300&h=300",
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
      console.log('[Seeder] All doctor profiles seeded in-memory successfully!');
    } catch (err) {
      console.error(`[Seeder Error] Doctor seeding failed in-memory: ${err.message}`);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`[Server] Running with memory database in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`[Server] Ready for frontend connections.`);
    });

  } catch (error) {
    console.error(`[Dev DB Error] Failed to boot: ${error.message}`);
    process.exit(1);
  }
};

start();
