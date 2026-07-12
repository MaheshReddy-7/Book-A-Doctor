import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

export const FAQ = () => {
  const faqs = [
    {
      category: "Patient Account & Bookings",
      items: [
        {
          q: "How do I register a patient profile?",
          a: "Click on the 'Register' button on the navbar. Fill in your name, email, phone, birthday, gender, and passwords, then submit. You can log in immediately after registration."
        },
        {
          q: "How do I schedule a checkup?",
          a: "Head to the 'Doctors' search directory, find your matching clinic specialist, select 'View Profile' or 'Book Appointment', input symptoms, and choose a free date/time slot."
        },
        {
          q: "Are medical report uploads supported?",
          a: "Yes. During the appointment booking process, you can drag or select files (ECGs, photos, PDFs) to upload as reference medical documents."
        }
      ]
    },
    {
      category: "Doctor Portal & Scheduling",
      items: [
        {
          q: "How can I register my medical practice on the platform?",
          a: "Use the 'Doctor Registration' page linked in the login area. Complete your credentials, hospital details, and consult fees. Once approved by the administrator, your profile will appear on search queries."
        },
        {
          q: "How do I manage my available slots?",
          a: "Log in as a doctor, head to the 'Availability Shift' tab in your dashboard sidebar, select the weekdays you are active, and toggle slot intervals."
        },
        {
          q: "How do I upload a patient prescription?",
          a: "On your doctor dashboard, under 'Today's Visits' or 'Upcoming Slots', select the booking card, click 'Upload Prescription', input the diagnosis and medications, then sign."
        }
      ]
    },
    {
      category: "Admin Platform Monitoring",
      items: [
        {
          q: "How are new doctor applications monitored?",
          a: "Administrators see registration notifications. From the 'Pending Approvals' tab, they can review credentials and either click 'Approve' or 'Reject'."
        },
        {
          q: "Can administrators view billing statistics?",
          a: "Yes. The 'Financial Reports' and 'Platform Analytics' panels simulate total appointments, registered counts, average fees, and department summaries."
        }
      ]
    }
  ];

  return (
    <div className="container py-5 animate-fade-in">
      <div className="text-center max-w-xl mx-auto mb-5">
        <span className="badge-custom badge-custom-accent mb-2">Support Database</span>
        <h1 className="fw-bold text-dark display-5">Frequently Asked Questions</h1>
        <p className="text-secondary fs-6">Find quick answers below categorized by user roles and workflows.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-9">
          {faqs.map((cat, catIdx) => (
            <div key={catIdx} className="mb-5">
              <h3 className="fw-bold text-primary mb-3 h5 border-bottom pb-2">{cat.category}</h3>
              <div className="accordion accordion-flush" id={`faqAccordion-${catIdx}`}>
                {cat.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="accordion-item mb-2 card-custom border-0 overflow-hidden">
                    <h2 className="accordion-header" id={`head-${catIdx}-${itemIdx}`}>
                      <button 
                        className="accordion-button collapsed fw-bold text-dark fs-6 bg-white py-3 shadow-none border-0" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#collapse-${catIdx}-${itemIdx}`}
                        aria-expanded="false" 
                        aria-controls={`collapse-${catIdx}-${itemIdx}`}
                      >
                        <FaQuestionCircle className="text-accent me-2 flex-shrink-0" />
                        {item.q}
                      </button>
                    </h2>
                    <div 
                      id={`collapse-${catIdx}-${itemIdx}`} 
                      className="accordion-collapse collapse" 
                      aria-labelledby={`head-${catIdx}-${itemIdx}`} 
                      data-bs-parent={`#faqAccordion-${catIdx}`}
                    >
                      <div className="accordion-body text-secondary small bg-white pt-1 pb-3 px-4 border-top border-light">
                        {item.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
