export const doctors = [
  {
    id: "doc_1",
    name: "Dr. Alexander Bennett",
    specialization: "Cardiology",
    specializationKey: "cardiology",
    qualification: "MD, DM (Cardiology), FACC",
    experience: 14,
    hospital: "Metro Cardiac & Vascular Center",
    rating: 4.9,
    reviewsCount: 124,
    fee: 150,
    photo: "/doctor1.jpg",
    about: "Dr. Alexander Bennett is an internationally recognized cardiologist with over 14 years of experience. He specializes in interventional cardiology, heart failure management, and preventive cardiovascular care. He is dedicated to delivering patient-centered care and utilizing the latest cardiac innovations.",
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
    },
    approved: true
  },
  {
    id: "doc_2",
    name: "Dr. Sarah Jenkins",
    specialization: "Pediatrics",
    specializationKey: "pediatrics",
    qualification: "MD (Pediatrics), DCH",
    experience: 10,
    hospital: "St. Jude Children's Hospital",
    rating: 4.8,
    reviewsCount: 98,
    fee: 90,
    photo: "/doctor2.jpg",
    about: "Dr. Sarah Jenkins is a passionate pediatrician committed to child development and pediatric health. With 10 years of experience, Dr. Jenkins focuses on neonatology, asthma management, childhood nutrition, and routine wellness checks.",
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      slots: ["09:30 AM", "10:30 AM", "11:30 AM", "01:30 PM", "02:30 PM", "03:30 PM"]
    },
    approved: true
  },
  {
    id: "doc_3",
    name: "Dr. Marcus Vance",
    specialization: "Neurology",
    specializationKey: "neurology",
    qualification: "MD, PhD (Neurology)",
    experience: 18,
    hospital: "Brain & Spine Institute",
    rating: 4.7,
    reviewsCount: 76,
    fee: 180,
    photo: "/doctor3.jpg",
    about: "Dr. Marcus Vance is a renowned neurologist and researcher specializing in neurodegenerative diseases, epilepsy, and stroke therapy. He combines active clinical research with patient treatment to provide advanced therapeutic plans.",
    availability: {
      days: ["Monday", "Tuesday", "Thursday"],
      slots: ["10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
    },
    approved: true
  },
  {
    id: "doc_4",
    name: "Dr. Olivia Rodriguez",
    specialization: "Dermatology",
    specializationKey: "dermatology",
    qualification: "MD (Dermatology), Board Certified",
    experience: 8,
    hospital: "Aura Skin & Aesthetic Clinic",
    rating: 4.9,
    reviewsCount: 154,
    fee: 100,
    photo: "/doctor2.jpg",
    about: "Dr. Olivia Rodriguez is a board-certified dermatologist specializing in medical, surgical, and cosmetic dermatology. She provides comprehensive care for skin conditions ranging from acne and eczema to advanced cosmetic therapies.",
    availability: {
      days: ["Wednesday", "Thursday", "Friday"],
      slots: ["09:00 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"]
    },
    approved: true
  },
  {
    id: "doc_5",
    name: "Dr. James Carter",
    specialization: "Orthopedics",
    specializationKey: "orthopedics",
    qualification: "MS (Orthopedics), MCh (Joints)",
    experience: 15,
    hospital: "Orthopedic & Joint Care Hospital",
    rating: 4.6,
    reviewsCount: 88,
    fee: 130,
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    about: "Dr. James Carter is an orthopedic surgeon specializing in joint replacement, arthroscopy, and sports medicine. He has performed over 1,200 successful surgeries and focuses on helping patients regain active, pain-free lifestyles.",
    availability: {
      days: ["Monday", "Wednesday", "Saturday"],
      slots: ["08:30 AM", "09:30 AM", "10:30 AM", "01:30 PM", "02:30 PM", "03:30 PM"]
    },
    approved: true
  },
  {
    id: "doc_6",
    name: "Dr. Emily Taylor",
    specialization: "General Medicine",
    specializationKey: "general",
    qualification: "MBBS, MD (Internal Medicine)",
    experience: 12,
    hospital: "City Health Care Clinic",
    rating: 4.8,
    reviewsCount: 210,
    fee: 70,
    photo: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=300&h=300",
    about: "Dr. Emily Taylor is an internal medicine specialist focusing on comprehensive adult primary care. She deals with diabetic management, hypertension control, lifestyle counseling, and infectious diseases.",
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      slots: ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
    },
    approved: true
  },
  {
    id: "doc_7",
    name: "Dr. Vikram Rajan (Pending)",
    specialization: "Psychiatry",
    specializationKey: "psychiatry",
    qualification: "MD (Psychiatry), DPM",
    experience: 9,
    hospital: "Mind Care & Wellness Clinic",
    rating: 4.7,
    reviewsCount: 45,
    fee: 110,
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    about: "Dr. Vikram Rajan specializes in adult psychiatry, behavioral therapies, and stress management. He helps patients navigate complex anxiety conditions, mood disorders, and ADHD.",
    availability: {
      days: ["Tuesday", "Thursday"],
      slots: ["11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"]
    },
    approved: false // This doctor will appear in Admin's "Pending Approvals" screen!
  },
  {
    id: "doc_8",
    name: "Dr. Ramesh Reddy",
    specialization: "General Medicine",
    specializationKey: "general",
    qualification: "MBBS",
    experience: 10,
    hospital: "Reddy General Clinic",
    rating: 4.8,
    reviewsCount: 42,
    fee: 80,
    photo: "/dr_ramesh_reddy.png",
    about: "Dr. Ramesh Reddy is an experienced general practitioner dedicated to offering comprehensive patient-focused primary health care services.",
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
    },
    approved: true
  },
  {
    id: "doc_9",
    name: "Dr. Harris Valleru",
    specialization: "Cardiology",
    specializationKey: "cardiology",
    qualification: "MBBS, MD (Cardiology)",
    experience: 8,
    hospital: "Valleru Heart Care",
    rating: 4.9,
    reviewsCount: 37,
    fee: 120,
    photo: "/dr_harris_valleru.png",
    about: "Dr. Harris Valleru is a dedicated cardiologist specializing in non-invasive cardiology, heart health checkups, and cardiovascular disease prevention.",
    availability: {
      days: ["Monday", "Wednesday", "Thursday", "Friday"],
      slots: ["09:00 AM", "10:30 AM", "11:30 AM", "02:30 PM", "03:30 PM"]
    },
    approved: true
  },
  {
    id: "doc_10",
    name: "Dr. Rohan Gupta",
    specialization: "Pediatrics",
    specializationKey: "pediatrics",
    qualification: "MD (Pediatrics)",
    experience: 7,
    hospital: "Gupta Kids Clinic",
    rating: 4.7,
    reviewsCount: 29,
    fee: 95,
    photo: "/dr_rohan_gupta.png",
    about: "Dr. Rohan Gupta is a passionate young pediatrician focusing on child growth monitoring, vaccinations, and childhood illnesses.",
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      slots: ["10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"]
    },
    approved: true
  },
  {
    id: "doc_11",
    name: "Dr. Aisha Rahman",
    specialization: "Dermatology",
    specializationKey: "dermatology",
    qualification: "MD (Dermatology)",
    experience: 9,
    hospital: "Rahman Skin & Hair Clinic",
    rating: 4.8,
    reviewsCount: 51,
    fee: 110,
    photo: "/dr_aisha_rahman.png",
    about: "Dr. Aisha Rahman specializes in clinical dermatology, skin care therapies, and medical aesthetics for all age groups.",
    availability: {
      days: ["Wednesday", "Friday", "Saturday"],
      slots: ["09:00 AM", "10:00 AM", "11:00 AM", "03:00 PM", "04:00 PM"]
    },
    approved: true
  },
  {
    id: "doc_12",
    name: "Dr. David Miller",
    specialization: "Orthopedics",
    specializationKey: "orthopedics",
    qualification: "MS (Orthopedics)",
    experience: 15,
    hospital: "Miller Bone & Joint Care",
    rating: 4.6,
    reviewsCount: 63,
    fee: 140,
    photo: "/dr_david_miller.png",
    about: "Dr. David Miller is an orthopedic surgeon specializing in joint replacement, sports injury recovery, and fracture care.",
    availability: {
      days: ["Monday", "Tuesday", "Thursday"],
      slots: ["09:30 AM", "10:30 AM", "01:30 PM", "02:30 PM"]
    },
    approved: true
  },
  {
    id: "doc_13",
    name: "Dr. Priya Nair",
    specialization: "Psychiatry",
    specializationKey: "psychiatry",
    qualification: "MD (Psychiatry)",
    experience: 11,
    hospital: "Nair Mind Care Center",
    rating: 4.7,
    reviewsCount: 48,
    fee: 130,
    photo: "/dr_priya_nair.png",
    about: "Dr. Priya Nair provides compassionate psychological support, therapeutic sessions, and stress management coaching.",
    availability: {
      days: ["Tuesday", "Wednesday", "Friday"],
      slots: ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM"]
    },
    approved: true
  }
];
