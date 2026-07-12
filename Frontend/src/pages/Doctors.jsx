import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { doctorService } from '../services/doctorService';
import { SearchBar } from '../components/ui/SearchBar';
import { Rating } from '../components/ui/Rating';
import { Loader } from '../components/ui/Loader';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { FaUserMd, FaHospital, FaClock, FaDollarSign } from 'react-icons/fa';

export const Doctors = () => {
  const { specializations } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [maxFee, setMaxFee] = useState('');
  const [experience, setExperience] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchFilteredDoctors = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchQuery,
        specialization: specialization === 'All' ? '' : specialization,
        maxFee,
        experience,
        sortBy,
        approvedOnly: true // Patients should only see approved doctors!
      };
      const res = await doctorService.getDoctors(filters);
      setDoctorsList(res);
      setCurrentPage(1); // Reset page on filter/search trigger
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredDoctors();
  }, [specialization, maxFee, experience, sortBy]);

  const handleSearchTrigger = () => {
    setSearchParams({ search: searchQuery, specialization });
    fetchFilteredDoctors();
  };

  // Pagination indexing
  const totalPages = Math.ceil(doctorsList.length / itemsPerPage);
  const currentDoctors = doctorsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container py-5 animate-fade-in">
      <div className="text-center max-w-xl mx-auto mb-4">
        <span className="badge-custom badge-custom-primary mb-2">Doctor Directory</span>
        <h1 className="fw-bold text-dark display-5">Find Clinical Specialists</h1>
        <p className="text-secondary">Search and schedule appointments with top medical experts near you.</p>
      </div>

      {/* Main Search Panel */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        specialization={specialization}
        setSpecialization={setSpecialization}
        specializations={specializations}
        onSearch={handleSearchTrigger}
      />

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="card-custom p-4 glass-panel position-sticky" style={{ top: '100px' }}>
            <h3 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">Filter Options</h3>
            
            <div className="mb-3">
              <label className="form-label-custom">Maximum consultation fee</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted small"><FaDollarSign /></span>
                <input
                  type="number"
                  className="form-control form-control-custom ps-4"
                  placeholder="Any"
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Minimum Experience (Yrs)</label>
              <input
                type="number"
                className="form-control form-control-custom"
                placeholder="Any"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Sort Results By</label>
              <select
                className="form-select form-control-custom"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Years of Experience</option>
                <option value="fee-low">Fee: Low to High</option>
                <option value="fee-high">Fee: High to Low</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setSearchQuery('');
                setSpecialization('All');
                setMaxFee('');
                setExperience('');
                setSortBy('rating');
                setSearchParams({});
              }}
              className="btn btn-sm btn-outline-secondary w-100 py-2 rounded-3 mt-2"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Directory Listing area */}
        <div className="col-lg-9">
          {loading ? (
            <Loader size="large" />
          ) : currentDoctors.length === 0 ? (
            <EmptyState 
              title="No doctors match filters" 
              message="Try resetting experience years, department selectors, or fee inputs to explore profiles." 
            />
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3 text-secondary small">
                <span>Showing {currentDoctors.length} of {doctorsList.length} specialists</span>
              </div>

              <div className="d-flex flex-column gap-4">
                {currentDoctors.map((doc) => (
                  <div key={doc.id} className="card-custom overflow-hidden animate-slide-up">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover', minHeight: '220px' }}
                        />
                      </div>
                      
                      <div className="col-md-8 p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <span className="badge bg-primary bg-opacity-10 text-primary-hover border border-primary border-opacity-10 small mb-1">
                              {doc.specialization}
                            </span>
                            <h3 className="h5 fw-bold text-dark mb-0">{doc.name}</h3>
                            <div className="text-secondary small mt-1"><FaHospital className="me-1" /> {doc.hospital}</div>
                          </div>
                          
                          <div className="text-end">
                            <span className="text-muted small">Consult Fee</span>
                            <div className="fw-bold text-primary fs-5">${doc.fee}</div>
                          </div>
                        </div>

                        <p className="text-muted small flex-grow-1 text-truncate-3 mb-3" style={{ display: '-webkit-box', WebKitLineClamp: 2, WebKitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {doc.about}
                        </p>

                        <div className="row g-3 py-3 border-top border-bottom border-light mb-3">
                          <div className="col-6 col-sm-3">
                            <div className="text-muted small">Experience</div>
                            <div className="fw-semibold text-dark small">{doc.experience} Years</div>
                          </div>
                          <div className="col-6 col-sm-3">
                            <div className="text-muted small">Rating</div>
                            <Rating rating={doc.rating} reviewsCount={undefined} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <div className="text-muted small"><FaClock className="me-1" /> Active Shifts</div>
                            <div className="fw-semibold text-dark small text-truncate" style={{ fontSize: '0.75rem' }}>
                              {doc.availability.days.join(', ')}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                          <Link to={`/doctors/${doc.id}`} className="btn btn-secondary-custom px-4">
                            View Profile
                          </Link>
                          <Link to={`/patient/book-appointment?doctor=${doc.id}`} className="btn btn-primary-custom px-4">
                            Book Appointment
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination control */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Doctors;
