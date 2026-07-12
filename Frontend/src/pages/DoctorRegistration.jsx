import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { toast } from 'react-toastify';
import { FaHeartbeat, FaUser, FaEnvelope, FaLock, FaUserMd, FaHospital, FaArrowRight } from 'react-icons/fa';

export const DoctorRegistration = () => {
  const { registerDoctor } = useAuth();
  const { specializations } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerDoctor(data);
      toast.success("Application submitted successfully! Awaiting administrator approval.");
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="card-custom p-4 p-md-5 shadow-lg border border-light" style={{ maxWidth: '700px', width: '100%' }}>
        <div className="text-center mb-4">
          <Link className="d-inline-flex align-items-center gap-2 fw-bold text-accent text-decoration-none fs-3 mb-2" to="/">
            <span style={{ 
              color: 'white', 
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', 
              padding: '8px', 
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaHeartbeat />
            </span>
            <span>Book a Doctor</span>
          </Link>
          <h2 className="h4 text-dark fw-bold">Doctor Registration Portal</h2>
          <p className="text-secondary small">Join our network and manage your patient appointments</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label-custom">Full Name (without Dr. prefix)</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FaUser />
                </span>
                <input
                  type="text"
                  className={`form-control form-control-custom ps-5 ${errors.name ? 'is-invalid border-danger' : ''}`}
                  placeholder="Alexander Bennett"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <div className="invalid-feedback text-danger small mt-1">{errors.name.message}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Email Address</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className={`form-control form-control-custom ps-5 ${errors.email ? 'is-invalid border-danger' : ''}`}
                  placeholder="bennett@hospital.com"
                  {...register('email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && <div className="invalid-feedback text-danger small mt-1">{errors.email.message}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Phone Number</label>
              <input
                type="text"
                className={`form-control form-control-custom ${errors.phone ? 'is-invalid border-danger' : ''}`}
                placeholder="+1 (555) 234-5678"
                {...register('phone', { required: 'Phone is required' })}
              />
              {errors.phone && <div className="invalid-feedback text-danger small mt-1">{errors.phone.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Specialization</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FaUserMd />
                </span>
                <select 
                  className="form-select form-control-custom ps-5"
                  {...register('specialization', { required: 'Specialization is required' })}
                >
                  {specializations.map((spec) => (
                    <option key={spec.id} value={spec.name}>{spec.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Qualifications</label>
              <input
                type="text"
                className={`form-control form-control-custom ${errors.qualification ? 'is-invalid border-danger' : ''}`}
                placeholder="MD, DM (Cardiology), FACC"
                {...register('qualification', { required: 'Qualifications are required' })}
              />
              {errors.qualification && <div className="invalid-feedback text-danger small mt-1">{errors.qualification.message}</div>}
            </div>

            <div className="col-md-3 col-6">
              <label className="form-label-custom">Experience (Yrs)</label>
              <input
                type="number"
                className={`form-control form-control-custom ${errors.experience ? 'is-invalid border-danger' : ''}`}
                placeholder="10"
                {...register('experience', { required: 'Exp is required', min: 1 })}
              />
              {errors.experience && <div className="invalid-feedback text-danger small mt-1">{errors.experience.message}</div>}
            </div>

            <div className="col-md-3 col-6">
              <label className="form-label-custom">Consult Fee ($)</label>
              <input
                type="number"
                className={`form-control form-control-custom ${errors.fee ? 'is-invalid border-danger' : ''}`}
                placeholder="150"
                {...register('fee', { required: 'Fee is required', min: 10 })}
              />
              {errors.fee && <div className="invalid-feedback text-danger small mt-1">{errors.fee.message}</div>}
            </div>

            <div className="col-12">
              <label className="form-label-custom">Affiliated Hospital</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FaHospital />
                </span>
                <input
                  type="text"
                  className={`form-control form-control-custom ps-5 ${errors.hospital ? 'is-invalid border-danger' : ''}`}
                  placeholder="Metro Cardiac & Vascular Center"
                  {...register('hospital', { required: 'Hospital affiliation is required' })}
                />
                {errors.hospital && <div className="invalid-feedback text-danger small mt-1">{errors.hospital.message}</div>}
              </div>
            </div>

            <div className="col-12">
              <label className="form-label-custom">Short Bio / About Yourself</label>
              <textarea
                className="form-control form-control-custom"
                rows="3"
                placeholder="Briefly state your clinical specializations and patient practices..."
                {...register('about', { required: 'About biography is required' })}
              ></textarea>
              {errors.about && <div className="text-danger small mt-1">{errors.about.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Password</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FaLock />
                </span>
                <input
                  type="password"
                  className={`form-control form-control-custom ps-5 ${errors.password ? 'is-invalid border-danger' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && <div className="invalid-feedback text-danger small mt-1">{errors.password.message}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Confirm Password</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FaLock />
                </span>
                <input
                  type="password"
                  className={`form-control form-control-custom ps-5 ${errors.confirmPassword ? 'is-invalid border-danger' : ''}`}
                  placeholder="••••••••"
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: val => val === passwordVal || 'Passwords do not match'
                  })}
                />
                {errors.confirmPassword && <div className="invalid-feedback text-danger small mt-1">{errors.confirmPassword.message}</div>}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-accent-custom w-100 py-3 justify-content-center mb-3"
          >
            {loading ? 'Submitting Application...' : 'Submit Doctor Application'} <FaArrowRight />
          </button>
        </form>

        <div className="text-center text-muted small mt-2">
          Already registered? <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
};
export default DoctorRegistration;
