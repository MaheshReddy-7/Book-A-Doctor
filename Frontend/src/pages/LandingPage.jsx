import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/ui/SearchBar';
import { Rating } from '../components/ui/Rating';
import { 
  FaUserMd, FaCalendarPlus, FaCertificate, FaShieldAlt, 
  FaStar, FaQuoteLeft, FaQuestionCircle, FaEnvelope, 
  FaPhone, FaMapMarkerAlt, FaCalendarCheck
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export const LandingPage = () => {
  const { doctors, specializations } = useApp();
  const navigate = useNavigate();
  
  // Search query states
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('All');

  const handleSearch = () => {
    navigate(`/doctors?search=${searchQuery}&specialization=${specialization}`);
  };

  // Only display approved doctors for featured section
  const featuredDoctors = doctors.filter(d => d.approved).slice(0, 3);

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Mother of 2",
      text: "Booking a pediatrician was incredibly fast. I scheduled a consultation with Dr. Jenkins in under 2 minutes, and the diagnostic plan was uploaded right after the visit.",
      rating: 5,
    },
    {
      name: "David K.",
      role: "Cardiac Patient",
      text: "Dr. Bennett is amazing. The platform made it simple to upload my latest ECG report, and I could view all prescriptions and checkups on the patient portal dashboard.",
      rating: 5,
    },
    {
      name: "Melissa Gomez",
      role: "Corporate Worker",
      text: "Saves so much time! I didn't have to wait in line. The layout of cards and booking times are super clean and easy to follow.",
      rating: 4.8,
    }
  ];

  const faqs = [
    {
      q: "How do I book an appointment?",
      a: "Simply search for a doctor in your preferred department, click 'Book Appointment', select your desired date and time, fill in your symptoms, and submit the booking request."
    },
    {
      q: "Can I manage or cancel my appointments?",
      a: "Yes. From your patient dashboard, you can track all upcoming bookings, reschedule, or cancel them up to 24 hours in advance."
    },
    {
      q: "How will I receive my prescription?",
      a: "Once your consultation is completed, the doctor will upload the prescription directly. You can view, print, or download it from your 'Reports' dashboard."
    }
  ];

  return (
    <div className="landing-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(14, 165, 233, 0.05))' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge-custom badge-custom-primary mb-3">Connecting Care Worldwide</span>
              <h1 className="display-4 fw-extrabold text-dark mb-3" style={{ lineHeight: '1.2' }}>
                Your Health, Our Priority. <span className="text-primary">Find the Best Doctors.</span>
              </h1>
              <p className="text-secondary fs-5 mb-4" style={{ lineHeight: '1.6' }}>
                Access certified medical specialists, schedule instant consultations, and manage your health reports in one secure platform.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link to="/doctors" className="btn-primary-custom text-decoration-none">
                  <FaCalendarPlus /> Book Appointment
                </Link>
                <Link to="/about" className="btn-secondary-custom text-decoration-none">
                  Learn More
                </Link>
              </div>

              {/* Mini Stats Cards */}
              <div className="row g-3">
                <div className="col-sm-4 col-6">
                  <div className="glass-card p-3 text-center">
                    <h3 className="fw-bold text-primary mb-1">500+</h3>
                    <p className="text-muted small mb-0">Certified Doctors</p>
                  </div>
                </div>
                <div className="col-sm-4 col-6">
                  <div className="glass-card p-3 text-center">
                    <h3 className="fw-bold text-primary mb-1">20k+</h3>
                    <p className="text-muted small mb-0">Happy Patients</p>
                  </div>
                </div>
                <div className="col-sm-4 col-12">
                  <div className="glass-card p-3 text-center">
                    <h3 className="fw-bold text-primary mb-1">99.2%</h3>
                    <p className="text-muted small mb-0">Satisfaction Rate</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block position-relative">
              <div className="position-absolute bg-primary rounded-circle opacity-10 blur-3xl" style={{ width: '400px', height: '400px', top: '-50px', right: '-50px', filter: 'blur(80px)' }}></div>
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=500" 
                alt="Healthcare Professionals" 
                className="img-fluid rounded-4 shadow-lg"
                style={{ objectFit: 'cover', border: '8px solid white' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Directory Search Panel */}
      <section className="container mt-n5 position-relative" style={{ zIndex: 10 }}>
        <div className="mt-n5">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            specialization={specialization}
            setSpecialization={setSpecialization}
            specializations={specializations}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Popular Specializations */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge-custom badge-custom-accent mb-2">Departments</span>
            <h2 className="fw-bold text-dark">Popular Specializations</h2>
            <p className="text-muted">Find doctors by choosing from our clinical departments</p>
          </div>

          <div className="row g-4">
            {specializations.slice(0, 4).map((spec) => (
              <div key={spec.id} className="col-xl-3 col-md-6">
                <Link to={`/doctors?specialization=${spec.key}`} className="text-decoration-none">
                  <div className="card-custom p-4 h-100 d-flex flex-column align-items-start">
                    <div 
                      className="d-flex align-items-center justify-content-center mb-3"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '12px', 
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                        color: 'var(--accent-hover)',
                        fontSize: '1.5rem'
                      }}
                    >
                      <FaUserMd />
                    </div>
                    <h4 className="h5 fw-bold text-dark mb-2">{spec.name}</h4>
                    <p className="text-secondary small mb-3 flex-grow-1">{spec.description}</p>
                    <span className="text-primary small fw-semibold">View Doctors &rarr;</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge-custom badge-custom-primary mb-2">Simple Process</span>
            <h2 className="fw-bold text-dark">How It Works</h2>
            <p className="text-muted">Get your appointment completed in 3 quick steps</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="p-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white mb-4 shadow" style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  1
                </div>
                <h4 className="fw-bold text-dark h5 mb-3">Search for Doctors</h4>
                <p className="text-secondary small">Filter certified professionals by specializations, consultation fees, and experience.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-accent text-white mb-4 shadow" style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  2
                </div>
                <h4 className="fw-bold text-dark h5 mb-3">Schedule a Time</h4>
                <p className="text-secondary small">Select your preferred date and slot from the doctor's real-time availability list.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-dark text-white mb-4 shadow" style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  3
                </div>
                <h4 className="fw-bold text-dark h5 mb-3">Consult and Heal</h4>
                <p className="text-secondary small">Attend your checkup and fetch your prescriptions instantly on your patient dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <span className="badge-custom badge-custom-primary mb-2">Our Top Doctors</span>
              <h2 className="fw-bold text-dark mb-0">Featured Doctors</h2>
            </div>
            <Link to="/doctors" className="btn btn-outline-primary rounded-3 text-decoration-none">
              View All Doctors
            </Link>
          </div>

          <div className="row g-4">
            {featuredDoctors.map((doc) => (
              <div key={doc.id} className="col-lg-4 col-md-6">
                <div className="card-custom h-100 overflow-hidden d-flex flex-column">
                  <div className="position-relative">
                    <img 
                      src={doc.photo} 
                      alt={doc.name} 
                      className="w-100" 
                      style={{ height: '240px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-white text-dark shadow-sm border border-light py-2 px-3 fw-semibold small rounded-pill">
                        ${doc.fee} / consultation
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-grow-1 d-flex flex-column">
                    <span className="text-accent small fw-bold text-uppercase tracking-wider">{doc.specialization}</span>
                    <h3 className="h5 fw-bold text-dark my-2">{doc.name}</h3>
                    <p className="text-secondary small mb-1">{doc.hospital}</p>
                    <p className="text-secondary small mb-3">Exp: {doc.experience} Years</p>
                    
                    <div className="mb-4">
                      <Rating rating={doc.rating} reviewsCount={doc.reviewsCount} />
                    </div>

                    <div className="mt-auto row g-2">
                      <div className="col-6">
                        <Link to={`/doctors/${doc.id}`} className="btn btn-secondary-custom w-100 py-2 justify-content-center text-decoration-none small">
                          Profile
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link to={`/patient/book-appointment?doctor=${doc.id}`} className="btn-primary-custom w-100 py-2 justify-content-center text-decoration-none small">
                          Book
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5" style={{ background: '#F8FAFC' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=500&h=400" 
                alt="Clinic Care" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
            <div className="col-lg-6">
              <span className="badge-custom badge-custom-accent mb-2">Quality Standards</span>
              <h2 className="fw-bold text-dark mb-4">Why Patients Trust Us</h2>
              
              <div className="d-flex gap-3 mb-4">
                <div 
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', fontSize: '1.25rem' }}
                >
                  <FaCertificate />
                </div>
                <div>
                  <h4 className="h5 fw-bold text-dark mb-1">100% Certified Specialists</h4>
                  <p className="text-secondary small">We perform multi-level medical license reviews before registering any doctor profile on our platform.</p>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <div 
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent)', fontSize: '1.25rem' }}
                >
                  <FaShieldAlt />
                </div>
                <div>
                  <h4 className="h5 fw-bold text-dark mb-1">Secure Medical Records</h4>
                  <p className="text-secondary small">Your uploads, symptoms details, and prescription records are fully private and encrypted.</p>
                </div>
              </div>

              <div className="d-flex gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#D97706', fontSize: '1.25rem' }}
                >
                  <FaCalendarCheck />
                </div>
                <div>
                  <h4 className="h5 fw-bold text-dark mb-1">Flexible Scheduling</h4>
                  <p className="text-secondary small">Easily coordinate times and view available doctor shifts to fit into your busy day.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge-custom badge-custom-primary mb-2">Feedbacks</span>
            <h2 className="fw-bold text-dark">Patient Testimonials</h2>
            <p className="text-muted">What our users say about the care they received</p>
          </div>

          <div className="row g-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div className="card-custom p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="text-primary mb-3 fs-3"><FaQuoteLeft /></div>
                    <p className="text-secondary small italic mb-4" style={{ fontStyle: 'italic', lineHeight: '1.6' }}>"{t.text}"</p>
                  </div>
                  <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="h6 fw-bold text-dark mb-0">{t.name}</h4>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{t.role}</span>
                    </div>
                    <div>
                      <Rating rating={t.rating} reviewsCount={undefined} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge-custom badge-custom-accent mb-2">Queries</span>
            <h2 className="fw-bold text-dark">Frequently Asked Questions</h2>
            <p className="text-muted">Quick answers to common questions about our platform</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="accordion accordion-flush" id="landingFaqAccordion">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="accordion-item mb-3 card-custom overflow-hidden border-0">
                    <h2 className="accordion-header" id={`faq-head-${idx}`}>
                      <button 
                        className="accordion-button collapsed fw-bold text-dark fs-6 bg-white py-3 shadow-none border-0" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#faq-collapse-${idx}`}
                        aria-expanded="false" 
                        aria-controls={`faq-collapse-${idx}`}
                      >
                        <FaQuestionCircle className="text-primary me-2 flex-shrink-0" />
                        {faq.q}
                      </button>
                    </h2>
                    <div 
                      id={`faq-collapse-${idx}`} 
                      className="accordion-collapse collapse" 
                      aria-labelledby={`faq-head-${idx}`} 
                      data-bs-parent="#landingFaqAccordion"
                    >
                      <div className="accordion-body text-secondary small bg-white pt-1 pb-3 px-4 border-top border-light">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="row g-5">
            <div className="col-lg-5">
              <span className="badge-custom badge-custom-primary mb-2">Support</span>
              <h2 className="fw-bold text-dark mb-3">Get in Touch</h2>
              <p className="text-muted small mb-4">Have questions about registration or billing? Our patient relations team is here to assist you 24/7.</p>
              
              <div className="d-flex gap-3 mb-3 align-items-center">
                <div className="d-flex align-items-center justify-content-center text-primary fs-5" style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.05)' }}><FaEnvelope /></div>
                <div>
                  <h4 className="fw-semibold text-dark mb-0 small">Email Us</h4>
                  <span className="text-secondary small">support@bookadoctor.com</span>
                </div>
              </div>

              <div className="d-flex gap-3 mb-3 align-items-center">
                <div className="d-flex align-items-center justify-content-center text-primary fs-5" style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.05)' }}><FaPhone /></div>
                <div>
                  <h4 className="fw-semibold text-dark mb-0 small">Call Support</h4>
                  <span className="text-secondary small">+1 (555) 234-5678</span>
                </div>
              </div>

              <div className="d-flex gap-3 align-items-center">
                <div className="d-flex align-items-center justify-content-center text-primary fs-5" style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.05)' }}><FaMapMarkerAlt /></div>
                <div>
                  <h4 className="fw-semibold text-dark mb-0 small">Main Office</h4>
                  <span className="text-secondary small">742 Evergreen Terrace, Springfield</span>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="glass-panel p-4 rounded-4 shadow-sm border border-light">
                <h4 className="fw-bold text-dark h5 mb-3">Send a Message</h4>
                <form onSubmit={(e) => { e.preventDefault(); toast.success("Your message has been sent successfully!"); e.target.reset(); }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label-custom">Name</label>
                      <input type="text" required className="form-control form-control-custom" placeholder="John Doe" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-custom">Email</label>
                      <input type="email" required className="form-control form-control-custom" placeholder="john@example.com" />
                    </div>
                    <div className="col-12">
                      <label className="form-label-custom">Subject</label>
                      <input type="text" required className="form-control form-control-custom" placeholder="Appointment query" />
                    </div>
                    <div className="col-12">
                      <label className="form-label-custom">Message</label>
                      <textarea required className="form-control form-control-custom" rows="4" placeholder="Type your message details..."></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary-custom w-100 justify-content-center">Submit Message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
