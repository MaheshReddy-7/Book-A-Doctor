import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeartbeat, FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight } from 'react-icons/fa';

export const Register = () => {
  const { registerPatient } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerPatient(data);
      toast.success("Registration successful! Please log in.");
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="card-custom p-4 p-md-5 shadow-lg border border-light" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="text-center mb-4">
          <Link className="d-inline-flex align-items-center gap-2 fw-bold text-primary text-decoration-none fs-3 mb-2" to="/">
            <span style={{ 
              color: 'white', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
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
          <h2 className="h4 text-dark fw-bold">Register Patient Profile</h2>
          <p className="text-secondary small">Join and book appointments in seconds</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label-custom">Full Name</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FaUser />
                </span>
                <input
                  type="text"
                  className={`form-control form-control-custom ps-5 ${errors.name ? 'is-invalid border-danger' : ''}`}
                  placeholder="John Doe"
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
                  placeholder="john@example.com"
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
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <FaPhone />
                </span>
                <input
                  type="text"
                  className={`form-control form-control-custom ps-5 ${errors.phone ? 'is-invalid border-danger' : ''}`}
                  placeholder="+1 (555) 019-2834"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[0-9\s-()]{7,15}$/,
                      message: 'Invalid phone format (must be 7-15 digits)'
                    }
                  })}
                />
                {errors.phone && <div className="invalid-feedback text-danger small mt-1">{errors.phone.message}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Date of Birth</label>
              <input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                className={`form-control form-control-custom ${errors.dob ? 'is-invalid border-danger' : ''}`}
                {...register('dob', { 
                  required: 'Date of birth is required',
                  validate: value => new Date(value) < new Date() || 'Date of birth must be in the past'
                })}
              />
              {errors.dob && <div className="invalid-feedback text-danger small mt-1">{errors.dob.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Gender</label>
              <select 
                className="form-select form-control-custom"
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Blood Group</label>
              <select 
                className="form-select form-control-custom"
                {...register('bloodGroup', { required: 'Blood group is required' })}
              >
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
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="123 Elm St, Metro City, NY"
                {...register('address')}
              />
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
                    },
                    pattern: {
                      value: /\d/,
                      message: 'Password must contain at least one number'
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
            className="btn btn-primary-custom w-100 py-3 justify-content-center mb-3"
          >
            {loading ? 'Registering...' : 'Register Profile'} <FaArrowRight />
          </button>
        </form>

        <div className="text-center text-muted small mt-2">
          Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
