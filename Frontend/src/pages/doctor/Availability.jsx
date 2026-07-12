import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';
import { Loader } from '../../components/ui/Loader';

export const Availability = () => {
  const { user } = useAuth();
  const { updateDoctorAvailability } = useApp();

  const [activeDays, setActiveDays] = useState(user?.availability?.days || []);
  const [activeSlots, setActiveSlots] = useState(user?.availability?.slots || []);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) return <Loader size="large" />;

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayToggle = (day) => {
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter(d => d !== day));
    } else {
      setActiveDays([...activeDays, day]);
    }
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlotTime) return;
    
    // Check if slot already exists
    if (activeSlots.includes(newSlotTime)) {
      toast.warning("Timeslot already exists.");
      return;
    }

    setActiveSlots([...activeSlots, newSlotTime].sort());
    setNewSlotTime('');
    toast.success("Timeslot added.");
  };

  const handleRemoveSlot = (slot) => {
    setActiveSlots(activeSlots.filter(s => s !== slot));
    toast.info("Timeslot removed.");
  };

  const handleSave = async () => {
    if (activeDays.length === 0) {
      toast.error("Please select at least one active weekday.");
      return;
    }
    if (activeSlots.length === 0) {
      toast.error("Please configure at least one active consultation timeslot.");
      return;
    }

    setSaving(true);
    try {
      await updateDoctorAvailability(user.id, {
        days: activeDays,
        slots: activeSlots
      });
      toast.success("Availability schedules updated successfully!");
    } catch (err) {
      toast.error("Failed to update availability.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="availability animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="card-custom p-4 p-md-5 bg-white border border-light">
        <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-3 d-flex align-items-center gap-2">
          <FaCalendarAlt className="text-primary" /> Availability Shift Scheduler
        </h3>

        <div className="row g-4 mb-4">
          {/* Weekday Selection */}
          <div className="col-12">
            <label className="form-label-custom d-block mb-3">Consultation Weekdays</label>
            <div className="d-flex flex-wrap gap-3">
              {weekdays.map((day) => (
                <div key={day} className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`day-${day}`}
                    checked={activeDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                  <label className="form-check-label text-secondary small cursor-pointer" htmlFor={`day-${day}`}>
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slot Configurations */}
          <div className="col-12 border-top pt-4">
            <label className="form-label-custom d-block mb-3">Active Consultation Timeslots</label>
            
            <form onSubmit={handleAddSlot} className="row g-2 align-items-center mb-4">
              <div className="col-sm-6 col-8">
                <input
                  type="text"
                  className="form-control form-control-custom"
                  placeholder="E.g. 10:30 AM, 02:30 PM"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                />
              </div>
              <div className="col-sm-3 col-4">
                <button type="submit" className="btn btn-primary-custom w-100 py-2 justify-content-center">
                  Add Slot
                </button>
              </div>
            </form>

            <div className="row g-2">
              {activeSlots.length === 0 ? (
                <div className="col-12 text-muted small italic">No active timeslots configured yet.</div>
              ) : (
                activeSlots.map((slot, idx) => (
                  <div key={idx} className="col-sm-4 col-6">
                    <div className="p-2 border rounded-4 d-flex justify-content-between align-items-center bg-light">
                      <span className="small fw-semibold text-dark"><FaClock className="text-secondary me-2" /> {slot}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSlot(slot)} 
                        className="btn btn-link text-danger p-0 border-0 text-decoration-none fs-6 fw-bold"
                        title="Remove timeslot"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="border-top pt-4 text-end">
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={saving}
            className="btn btn-primary-custom px-4 shadow"
          >
            {saving ? 'Updating...' : 'Save Availability Shifts'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Availability;
