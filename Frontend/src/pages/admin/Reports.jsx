import React from 'react';
import { useApp } from '../../context/AppContext';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { FaFileMedical, FaDollarSign, FaFileInvoiceDollar, FaRegCreditCard } from 'react-icons/fa';

export const AdminReports = () => {
  const { appointments, loading } = useApp();

  if (loading) return <Loader size="large" />;

  const completedApts = appointments.filter(apt => apt.status === 'Completed');

  // Calculations
  const grossRevenues = completedApts.length * 120; // Average consult fee of $120
  const platformCommissions = grossRevenues * 0.15; // 15% platform commission cut
  const payoutToDoctors = grossRevenues - platformCommissions;

  return (
    <div className="admin-reports animate-fade-in">
      <div className="row g-4 mb-4">
        {/* Metric 1 */}
        <div className="col-md-4">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', fontSize: '1.5rem' }}
            >
              <FaDollarSign />
            </div>
            <div>
              <span className="text-muted small">Gross Consult Billings</span>
              <h3 className="fw-bold text-dark mb-0">${grossRevenues}</h3>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="col-md-4">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent)', fontSize: '1.5rem' }}
            >
              <FaFileInvoiceDollar />
            </div>
            <div>
              <span className="text-muted small">Platform Cut (15% commission)</span>
              <h3 className="fw-bold text-dark mb-0">${platformCommissions.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-md-4">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '1.5rem' }}
            >
              <FaRegCreditCard />
            </div>
            <div>
              <span className="text-muted small">Payout due to Doctors</span>
              <h3 className="fw-bold text-dark mb-0">${payoutToDoctors.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card-custom p-4 bg-white border border-light">
        <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-2">Consultation Invoices</h3>

        {completedApts.length === 0 ? (
          <EmptyState 
            title="No billing reports available" 
            message="Statements are generated once medical checkups are completed by specialists." 
            icon={FaFileMedical} 
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Patient Details</th>
                  <th>Assigned Doctor</th>
                  <th>Consultation Date</th>
                  <th>Gross Bill</th>
                  <th>Commission Cut</th>
                  <th>Payout Status</th>
                </tr>
              </thead>
              <tbody>
                {completedApts.map((apt) => (
                  <tr key={apt.id}>
                    <td><strong>{apt.id}</strong></td>
                    <td>{apt.patientName}</td>
                    <td>{apt.doctorName}</td>
                    <td>{apt.date}</td>
                    <td><strong>$120.00</strong></td>
                    <td className="text-secondary">$18.00</td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success-hover border border-success border-opacity-10 py-1 px-2 fw-semibold" style={{ color: '#059669', fontSize: '0.7rem' }}>
                        TRANSFERRED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminReports;
