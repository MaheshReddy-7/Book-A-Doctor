import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaHospital, FaGraduationCap, FaDollarSign } from 'react-icons/fa';
import { Loader } from '../../components/ui/Loader';

export const DoctorProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      qualification: user?.qualification || '',
      hospital: user?.hospital || '',
      experience: user?.experience || '',
      fee: user?.fee || '',
      about: user?.about || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile({
        ...data,
        fee: parseInt(data.fee),
        experience: parseInt(data.experience)
      });
      toast.success("Doctor profile settings saved!");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader size="large" />;

  return (
    <div className="doctor-profile animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="card-custom p-4 p-md-5 bg-white border border-light">
        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
          <img 
            src={user.photo} 
            alt={user.name} 
            className="rounded-circle shadow-sm"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <div>
            <h3 className="h5 fw-bold text-dark mb-1">{user.name}</h3>
            <span className="text-secondary small">{user.specialization} specialist</span>
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
              <label className="form-label-custom">Qualifications</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><FaGraduationCap /></span>
                <input
                  type="text"
                  className={`form-control form-control-custom ps-5 ${errors.qualification ? 'is-invalid border-danger' : ''}`}
                  {...register('qualification', { required: 'Qualifications required' })}
                />
                {errors.qualification && <div className="invalid-feedback text-danger small mt-1">{errors.qualification.message}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Hospital Affiliation</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><FaHospital /></span>
                <input
                  type="text"
                  className={`form-control form-control-custom ps-5 ${errors.hospital ? 'is-invalid border-danger' : ''}`}
                  {...register('hospital', { required: 'Hospital required' })}
                />
                {errors.hospital && <div className="invalid-feedback text-danger small mt-1">{errors.hospital.message}</div>}
              </div>
            </div>

            <div className="col-md-3 col-6">
              <label className="form-label-custom">Experience (Yrs)</label>
              <input
                type="number"
                className={`form-control form-control-custom ${errors.experience ? 'is-invalid border-danger' : ''}`}
                {...register('experience', { required: 'Required', min: 1 })}
              />
              {errors.experience && <div className="invalid-feedback text-danger small mt-1">{errors.experience.message}</div>}
            </div>

            <div className="col-md-3 col-6">
              <label className="form-label-custom">Consult Fee ($)</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><FaDollarSign /></span>
                <input
                  type="number"
                  className={`form-control form-control-custom ps-4 ${errors.fee ? 'is-invalid border-danger' : ''}`}
                  {...register('fee', { required: 'Required', min: 10 })}
                />
                {errors.fee && <div className="invalid-feedback text-danger small mt-1">{errors.fee.message}</div>}
              </div>
            </div>

            <div className="col-12">
              <label className="form-label-custom">Short Bio / Practices biography</label>
              <textarea
                className={`form-control form-control-custom ${errors.about ? 'is-invalid border-danger' : ''}`}
                rows="4"
                {...register('about', { required: 'Bio required' })}
              ></textarea>
              {errors.about && <div className="invalid-feedback text-danger small mt-1">{errors.about.message}</div>}
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
export default DoctorProfile;
