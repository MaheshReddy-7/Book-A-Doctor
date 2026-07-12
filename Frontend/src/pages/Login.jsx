import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeartbeat, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Navigate to correct dashboard based on role
      navigate(`/${user.role}/dashboard`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autoFill = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="card-custom p-4 p-md-5 shadow-lg border border-light" style={{ maxWidth: '480px', width: '100%' }}>
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
          <h2 className="h4 text-dark fw-bold">Sign In to Your Account</h2>
          <p className="text-secondary small">Access appointments, medical logs, and bills</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <div className="mb-3">
            <label className="form-label-custom">Email Address</label>
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className={`form-control form-control-custom ps-5 ${errors.email ? 'is-invalid border-danger' : ''}`}
                placeholder="patient@bookadoctor.com"
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

          <div className="mb-4">
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

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary-custom w-100 py-3 justify-content-center"
          >
            {loading ? 'Signing In...' : 'Sign In'} <FaArrowRight />
          </button>
        </form>

        {/* Demo Quick login triggers */}
        <div className="p-3 bg-secondary bg-opacity-5 rounded-4 border border-light mb-4">
          <div className="text-secondary small fw-bold text-uppercase tracking-wider mb-2" style={{ fontSize: '0.7rem' }}>
            Demo Quick Autofill accounts:
          </div>
          <div className="d-flex flex-column gap-1">
            <button 
              type="button" 
              onClick={() => autoFill('patient@bookadoctor.com', 'Password123')}
              className="btn btn-sm btn-outline-primary text-start border-0 py-1"
              style={{ fontSize: '0.8rem' }}
            >
              Patient Role &rarr; <span className="text-muted">(patient@bookadoctor.com)</span>
            </button>
            <button 
              type="button" 
              onClick={() => autoFill('doctor@bookadoctor.com', 'Password123')}
              className="btn btn-sm btn-outline-primary text-start border-0 py-1"
              style={{ fontSize: '0.8rem' }}
            >
              Doctor Role &rarr; <span className="text-muted">(doctor@bookadoctor.com)</span>
            </button>
            <button 
              type="button" 
              onClick={() => autoFill('admin@bookadoctor.com', 'Password123')}
              className="btn btn-sm btn-outline-primary text-start border-0 py-1"
              style={{ fontSize: '0.8rem' }}
            >
              Admin Role &rarr; <span className="text-muted">(admin@bookadoctor.com)</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="text-muted small mb-2">
            Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-bold">Register as Patient</Link>
          </div>
          <div className="text-muted small">
            Are you a doctor? <Link to="/register-doctor" className="text-accent text-decoration-none fw-bold">Doctor Registration</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
