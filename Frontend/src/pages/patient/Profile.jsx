import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaPhone, FaMapMarkerAlt, FaHeartbeat } from 'react-icons/fa';

export const PatientProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dob: user?.dob || '',
      gender: user?.gender || 'Male',
      bloodGroup: user?.bloodGroup || 'O+',
      address: user?.address || '',
      allergies: user?.allergies || '',
      chronicConditions: user?.chronicConditions || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-profile animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="card-custom p-4 p-md-5 bg-white border border-light">
        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
          <img 
            src={user?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"} 
            alt={user?.name} 
            className="rounded-circle shadow-sm"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <div>
            <h3 className="h5 fw-bold text-dark mb-1">{user?.name}</h3>
            <span className="text-secondary small">Patient ID: {user?.id}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label-custom">Full Name</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><FaUser /></span>
                <input
                  type="text"
                  className={`form-control form-control-custom ps-5 ${errors.name ? 'is-invalid border-danger' : ''}`}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <div className="invalid-feedback text-danger small mt-1">{errors.name.message}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Email Address (disabled)</label>
              <input
                type="email"
                disabled
                className="form-control form-control-custom bg-light"
                {...register('email')}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Phone Number</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><FaPhone /></span>
                <input
                  type="text"
                  className={`form-control form-control-custom ps-5 ${errors.phone ? 'is-invalid border-danger' : ''}`}
                  {...register('phone', { required: 'Phone is required' })}
                />
                {errors.phone && <div className="invalid-feedback text-danger small mt-1">{errors.phone.message}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Date of Birth</label>
              <input
                type="date"
                className={`form-control form-control-custom ${errors.dob ? 'is-invalid border-danger' : ''}`}
                {...register('dob', { required: 'DOB is required' })}
              />
              {errors.dob && <div className="invalid-feedback text-danger small mt-1">{errors.dob.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Gender</label>
              <select className="form-select form-control-custom" {...register('gender')}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Blood Group</label>
              <select className="form-select form-control-custom" {...register('bloodGroup')}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label-custom">Home Address</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><FaMapMarkerAlt /></span>
                <input
                  type="text"
                  className="form-control form-control-custom ps-5"
                  {...register('address')}
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Medical Allergies</label>
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="Penicillin, Pollen, etc."
                {...register('allergies')}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Chronic Conditions</label>
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="Diabetes, Asthma, etc."
                {...register('chronicConditions')}
              />
            </div>

            <div className="col-12 mt-4 text-end">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary-custom px-4"
              >
                {loading ? 'Saving...' : 'Save Profile Details'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PatientProfile;
