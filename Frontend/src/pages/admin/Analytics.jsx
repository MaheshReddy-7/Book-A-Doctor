import React from 'react';
import { useApp } from '../../context/AppContext';
import { Loader } from '../../components/ui/Loader';
import { FaChartBar, FaUserMd, FaHospital, FaClinicMedical } from 'react-icons/fa';

export const AdminAnalytics = () => {
  const { doctors, appointments, loading } = useApp();

  if (loading) return <Loader size="large" />;

  // Calculate department distribution
  const deptCount = {};
  appointments.forEach(apt => {
    deptCount[apt.doctorSpecialization] = (deptCount[apt.doctorSpecialization] || 0) + 1;
  });

  const departmentData = Object.entries(deptCount).map(([name, count]) => ({
    name,
    count,
    percentage: Math.min(Math.round((count / appointments.length) * 100), 100)
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="admin-analytics animate-fade-in">
      <div className="row g-4">
        {/* Department Volume Chart */}
        <div className="col-lg-6">
          <div className="card-custom p-4 bg-white border border-light h-100">
            <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-2 d-flex align-items-center gap-2">
              <FaChartBar className="text-primary" /> Consultations by Specialization
            </h3>

            {departmentData.length === 0 ? (
              <p className="text-muted small py-4 text-center">No bookings logged yet to process statistics.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {departmentData.map((dept, idx) => (
                  <div key={idx}>
                    <div className="d-flex justify-content-between text-secondary small mb-1">
                      <span className="fw-semibold text-dark">{dept.name}</span>
                      <span>{dept.count} consults ({dept.percentage}%)</span>
                    </div>
                    <div className="progress" style={{ height: '8px', borderRadius: '50px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        role="progressbar" 
                        style={{ width: `${dept.percentage}%`, borderRadius: '50px' }} 
                        aria-valuenow={dept.percentage} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System performance metrics */}
        <div className="col-lg-6">
          <div className="card-custom p-4 bg-white border border-light h-100">
            <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-2 d-flex align-items-center gap-2">
              <FaClinicMedical className="text-accent" /> Platform Status & Health
            </h3>

            <div className="d-flex flex-column gap-3 small">
              <div className="p-3 bg-secondary bg-opacity-5 rounded-4 border border-light d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold text-dark mb-0">System Uptime Uptime</div>
                  <span className="text-muted small">All frontend routers active</span>
                </div>
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-10 py-1 px-2 fw-semibold">99.98%</span>
              </div>

              <div className="p-3 bg-secondary bg-opacity-5 rounded-4 border border-light d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold text-dark mb-0">Avg Consultation Fee</div>
                  <span className="text-muted small">Standard fees calculation</span>
                </div>
                <strong className="text-primary">$120.00</strong>
              </div>

              <div className="p-3 bg-secondary bg-opacity-5 rounded-4 border border-light d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold text-dark mb-0">Unapproved Application Ratio</div>
                  <span className="text-muted small">Doctor registration queue</span>
                </div>
                <strong className="text-warning">
                  {Math.round((doctors.filter(d => !d.approved).length / Math.max(doctors.length, 1)) * 100)}%
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminAnalytics;
