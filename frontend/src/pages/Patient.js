import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Patient.css";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("Patient");

  useEffect(() => {
    // Check authentication - COMMENT OUT IF TESTING
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   navigate("/");
    //   return;
    // }

    // Get patient name
    const name = localStorage.getItem("userName") || "Patient";
    setPatientName(name);

    // Load data
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes] = await Promise.all([
        api.get("/appointments/patient/my")
      ]);
      setAppointments(appointmentsRes.data);

      // Try to load bills (might not be available)
      try {
        const billsRes = await api.get("/billing/my");
        setBills(billsRes.data);
      } catch (err) {
        console.log("Bills not available");
      }

      // Extract unique doctors from appointments
      const uniqueDoctors = [];
      const doctorMap = new Map();
      appointmentsRes.data.forEach(apt => {
        if (!doctorMap.has(apt.DoctorName)) {
          doctorMap.set(apt.DoctorName, {
            name: apt.DoctorName,
            specialization: apt.Specialization || "General",
            appointments: 1
          });
          uniqueDoctors.push(doctorMap.get(apt.DoctorName));
        } else {
          doctorMap.get(apt.DoctorName).appointments++;
        }
      });
      setDoctors(uniqueDoctors);

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="patient-layout">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        logout={logout} 
        patientName={patientName} 
      />
      
      <main className="main-content">
        <TopHeader patientName={patientName} />
        
        <div className="content-wrapper">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {currentView === "dashboard" && <Overview appointments={appointments} bills={bills} />}
              {currentView === "appointments" && <Appointments appointments={appointments} doctors={doctors} reload={loadData} />}
              {currentView === "doctors" && <Doctors doctors={doctors} />}
              {currentView === "billing" && <Billing bills={bills} />}
              {currentView === "records" && <MedicalRecords appointments={appointments} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ========== SIDEBAR COMPONENT ==========
function Sidebar({ currentView, setCurrentView, logout, patientName }) {
  const menuItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "doctors", icon: "👨‍⚕️", label: "My Doctors" },
    { id: "records", icon: "📋", label: "Medical Records" },
    { id: "billing", icon: "💳", label: "Billing" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">TEAM UTPA</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? "active" : ""}`}
            onClick={() => setCurrentView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {patientName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">{patientName}</div>
            <div className="user-role">Patient</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

// ========== TOP HEADER COMPONENT ==========
function TopHeader({ patientName }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <h2>Welcome back, {patientName}!</h2>
      </div>
      <div className="header-right">
        <button className="notification-btn">
          🔔
          <span className="badge">2</span>
        </button>
        <img 
          src={`https://ui-avatars.com/api/?name=${patientName}&background=10b981&color=fff`}
          alt="User"
          className="user-avatar-small"
        />
      </div>
    </header>
  );
}

// ========== OVERVIEW/DASHBOARD VIEW ==========
function Overview({ appointments, bills }) {
  const upcomingAppts = appointments.filter(a => 
    new Date(a.AppointmentDate) >= new Date()
  );
  const nextAppointment = upcomingAppts[0];
  const totalBills = bills.reduce((sum, bill) => sum + (bill.Amount || 0), 0);
  const pendingBills = bills.filter(b => b.PaymentStatus === "Pending").length;

  const stats = [
    { icon: "📅", title: "Upcoming Appointments", value: upcomingAppts.length, color: "#6366f1" },
    { icon: "👨‍⚕️", title: "My Doctors", value: new Set(appointments.map(a => a.DoctorName)).size, color: "#10b981" },
    { icon: "💳", title: "Pending Bills", value: pendingBills, color: "#f59e0b" },
    { icon: "📋", title: "Total Visits", value: appointments.length, color: "#3b82f6" }
  ];

  return (
    <div className="overview-container">
      <h1 className="page-title">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ background: `${stat.color}15` }}>
              <span>{stat.icon}</span>
            </div>
            <div className="stat-content">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Appointment Card */}
      {nextAppointment && (
        <div className="next-appointment-card">
          <div className="appointment-badge">Next Appointment</div>
          <div className="appointment-details-large">
            <div className="appointment-date-large">
              <span className="day">{new Date(nextAppointment.AppointmentDate).getDate()}</span>
              <span className="month">{new Date(nextAppointment.AppointmentDate).toLocaleDateString('en', { month: 'short' })}</span>
            </div>
            <div className="appointment-info-large">
              <h3>Dr. {nextAppointment.DoctorName}</h3>
              <p className="specialization">{nextAppointment.Specialization}</p>
              <p className="time">⏰ {formatTime(nextAppointment.StartTime)} - {formatTime(nextAppointment.EndTime)}</p>
              <p className="reason">{nextAppointment.Reason || "General Checkup"}</p>
            </div>
            <div className="appointment-actions">
              <button className="btn-reschedule">Reschedule</button>
              <button className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card">
            <span className="action-icon">📅</span>
            <span className="action-label">Book Appointment</span>
          </button>
          <button className="action-card">
            <span className="action-icon">👨‍⚕️</span>
            <span className="action-label">Find Doctor</span>
          </button>
          <button className="action-card">
            <span className="action-icon">📋</span>
            <span className="action-label">View Records</span>
          </button>
          <button className="action-card">
            <span className="action-icon">💳</span>
            <span className="action-label">Pay Bills</span>
          </button>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Appointments</h2>
        </div>
        <div className="card-body">
          {appointments.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p>No appointments yet</p>
            </div>
          ) : (
            <div className="appointment-list">
              {appointments.slice(0, 5).map((apt) => (
                <div key={apt.AppointmentID} className="appointment-item">
                  <div className="appointment-date-small">
                    <span className="day">{new Date(apt.AppointmentDate).getDate()}</span>
                    <span className="month">{new Date(apt.AppointmentDate).toLocaleDateString('en', { month: 'short' })}</span>
                  </div>
                  <div className="appointment-info">
                    <div className="doctor-name">Dr. {apt.DoctorName}</div>
                    <div className="appointment-time">
                      {formatTime(apt.StartTime)} • {apt.Specialization}
                    </div>
                  </div>
                  <div className={`status-badge ${apt.Status.toLowerCase()}`}>
                    {apt.Status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== APPOINTMENTS VIEW ==========
function Appointments({ appointments, doctors, reload }) {
  const [showBooking, setShowBooking] = useState(false);
  const [filter, setFilter] = useState("all");
  const [bookingForm, setBookingForm] = useState({
    doctorId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    reason: ""
  });

  const filtered = filter === "all" ? appointments : 
    appointments.filter(a => a.Status.toLowerCase() === filter);

  const handleBooking = async (e) => {
    e.preventDefault();
    alert("Booking appointment... (Connect to backend)");
    setShowBooking(false);
  };

  return (
    <div className="appointments-container">
      <div className="page-header">
        <h1 className="page-title">📅 My Appointments</h1>
        <button className="primary-btn" onClick={() => setShowBooking(true)}>
          ➕ Book New Appointment
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-tabs">
          {["all", "confirmed", "pending", "completed"].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-body no-padding">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(apt => (
                <tr key={apt.AppointmentID}>
                  <td>{formatDate(apt.AppointmentDate)}</td>
                  <td>{formatTime(apt.StartTime)}</td>
                  <td>
                    <div className="doctor-cell">
                      <div className="doctor-avatar-small">
                        {apt.DoctorName.charAt(0)}
                      </div>
                      <span>Dr. {apt.DoctorName}</span>
                    </div>
                  </td>
                  <td>{apt.Specialization}</td>
                  <td>{apt.Reason || "General Checkup"}</td>
                  <td>
                    <span className={`status-badge ${apt.Status.toLowerCase()}`}>
                      {apt.Status}
                    </span>
                  </td>
                  <td>
                    {apt.Status === "Confirmed" && (
                      <button className="action-btn-small cancel">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="modal-overlay" onClick={() => setShowBooking(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book New Appointment</h2>
              <button className="close-btn" onClick={() => setShowBooking(false)}>✕</button>
            </div>
            <form onSubmit={handleBooking} className="booking-form">
              <div className="form-group">
                <label>Doctor</label>
                <select 
                  value={bookingForm.doctorId}
                  onChange={(e) => setBookingForm({...bookingForm, doctorId: e.target.value})}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc, i) => (
                    <option key={i} value={i}>{doc.name} - {doc.specialization}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date"
                    value={bookingForm.appointmentDate}
                    onChange={(e) => setBookingForm({...bookingForm, appointmentDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input 
                    type="time"
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea 
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                  placeholder="Describe your symptoms or reason for visit"
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowBooking(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== DOCTORS VIEW ==========
function Doctors({ doctors }) {
  return (
    <div className="doctors-container">
      <h1 className="page-title">👨‍⚕️ My Doctors</h1>

      <div className="doctors-grid">
        {doctors.map((doctor, i) => (
          <div key={i} className="doctor-card">
            <div className="doctor-avatar-large">
              {doctor.name.charAt(0)}
            </div>
            <h3>Dr. {doctor.name}</h3>
            <p className="doctor-specialization">{doctor.specialization}</p>
            <div className="doctor-stats">
              <div className="stat">
                <span className="stat-number">{doctor.appointments}</span>
                <span className="stat-label">Visits</span>
              </div>
            </div>
            <button className="btn-contact">Contact Doctor</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== MEDICAL RECORDS VIEW ==========
function MedicalRecords({ appointments }) {
  return (
    <div className="records-container">
      <h1 className="page-title">📋 Medical Records</h1>

      <div className="card">
        <div className="card-header">
          <h2>Visit History</h2>
        </div>
        <div className="card-body">
          {appointments.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No medical records yet</p>
            </div>
          ) : (
            <div className="records-list">
              {appointments.map((apt) => (
                <div key={apt.AppointmentID} className="record-item">
                  <div className="record-date">
                    {formatDate(apt.AppointmentDate)}
                  </div>
                  <div className="record-details">
                    <h4>Visit to Dr. {apt.DoctorName}</h4>
                    <p>{apt.Specialization}</p>
                    <p className="record-reason">{apt.Reason || "General Checkup"}</p>
                  </div>
                  <button className="action-btn">View Details</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== BILLING VIEW ==========
function Billing({ bills }) {
  const totalAmount = bills.reduce((sum, bill) => sum + (bill.Amount || 0), 0);
  const pendingAmount = bills
    .filter(b => b.PaymentStatus === "Pending")
    .reduce((sum, bill) => sum + (bill.Amount || 0), 0);

  return (
    <div className="billing-container">
      <h1 className="page-title">💳 Billing & Payments</h1>

      <div className="billing-stats">
        <div className="billing-stat-card">
          <span className="billing-stat-label">Total Amount</span>
          <span className="billing-stat-value">₹{totalAmount}</span>
        </div>
        <div className="billing-stat-card pending">
          <span className="billing-stat-label">Pending Amount</span>
          <span className="billing-stat-value">₹{pendingAmount}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Billing History</h2>
        </div>
        <div className="card-body no-padding">
          {bills.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💳</span>
              <p>No bills yet</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, i) => (
                  <tr key={i}>
                    <td>{formatDate(bill.DateIssued)}</td>
                    <td>Medical Services</td>
                    <td>₹{bill.Amount}</td>
                    <td>
                      <span className={`status-badge ${bill.PaymentStatus.toLowerCase()}`}>
                        {bill.PaymentStatus}
                      </span>
                    </td>
                    <td>
                      {bill.PaymentStatus === "Pending" && (
                        <button className="action-btn-small">Pay Now</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== HELPER COMPONENTS ==========
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

// ========== UTILITY FUNCTIONS ==========
function formatTime(time) {
  if (!time) return "N/A";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}