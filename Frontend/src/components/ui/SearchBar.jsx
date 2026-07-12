import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

export const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  specialization, 
  setSpecialization, 
  specializations = [], 
  onSearch, 
  placeholder = "Search doctors, hospitals, specializations...",
  showFilters = true
}) => {
  return (
    <div className="glass-panel p-4 rounded-4 mb-4">
      <form onSubmit={(e) => { e.preventDefault(); onSearch && onSearch(); }}>
        <div className="row g-3">
          <div className="col-lg-6 col-md-12">
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control form-control-custom ps-5 w-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
              />
            </div>
          </div>
          
          {showFilters && (
            <>
              <div className="col-lg-4 col-md-8">
                <div className="position-relative">
                  <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                    <FaFilter />
                  </span>
                  <select
                    className="form-select form-control-custom ps-5 w-100"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  >
                    <option value="All">All Specializations</option>
                    {specializations.map((spec) => (
                      <option key={spec.id} value={spec.key}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="col-lg-2 col-md-4">
                <button 
                  type="submit" 
                  className="btn btn-primary-custom w-100 h-100 justify-content-center"
                >
                  Search
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
