import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");
  const [wards, setWards] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    // Check authentication - COMMENT OUT IF TESTING
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   navigate("/");
    //   return;
    // }

    const name = localStorage.getItem("userName") || "Admin";
    setAdminName(name);

    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wardsRes] = await Promise.all([
        api.get("/wards")
      ]);
      setWards(wardsRes.data);

      // Try to get appointments if available
      try {
        const appointmentsRes = await api.get("/appointments/doctor/my");
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.log("Appointments not available for admin");
      }
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
    <div className="admin-layout">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        logout={logout} 
        adminName={adminName} 
      />
      
      <main className="main-content">
        <TopHeader adminName={adminName} />
        
        <div className="content-wrapper">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {currentView === "dashboard" && <Overview wards={wards} appointments={appointments} />}
              {currentView === "doctors" && <ManageDoctors />}
              {currentView === "patients" && <ManagePatients />}
              {currentView === "appointments" && <AllAppointments appointments={appointments} reload={loadData} />}
              {currentView === "wards" && <WardManagement wards={wards} reload={loadData} />}
              {currentView === "billing" && <BillingManagement />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ========== SIDEBAR COMPONENT ==========
function Sidebar({ currentView, setCurrentView, logout, adminName }) {
  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "doctors", icon: "👨‍⚕️", label: "Manage Doctors" },
    { id: "patients", icon: "👥", label: "Manage Patients" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "wards", icon: "🏥", label: "Ward Management" },
    { id: "billing", icon: "💰", label: "Billing & Revenue" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">TEAM UTPA</span>
        </div>
        <div className="admin-badge">ADMIN PANEL</div>
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
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">{adminName}</div>
            <div className="user-role">Administrator</div>
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
function TopHeader({ adminName }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <h2>Admin Dashboard</h2>
      </div>
      <div className="header-right">
        <button className="notification-btn">
          🔔
          <span className="badge">5</span>
        </button>
        <img 
          src={`https://ui-avatars.com/api/?name=${adminName}&background=f59e0b&color=fff`}
          alt="Admin"
          className="user-avatar-small"
        />
      </div>
    </header>
  );
}

// ========== OVERVIEW/DASHBOARD VIEW ==========
function Overview({ wards, appointments }) {
  const totalDoctors = 5; // Mock data
  const totalPatients = new Set(appointments.map(a => a.PatientName)).size;
  const todayAppointments = appointments.filter(a => 
    a.AppointmentDate.startsWith(new Date().toISOString().split("T")[0])
  ).length;
  const totalRevenue = 125000; // Mock data

  const stats = [
    { icon: "👨‍⚕️", title: "Total Doctors", value: totalDoctors, color: "#6366f1", trend: "+2 this month" },
    { icon: "👥", title: "Total Patients", value: totalPatients, color: "#10b981", trend: "+15 this week" },
    { icon: "📅", title: "Today's Appointments", value: todayAppointments, color: "#3b82f6", trend: "" },
    { icon: "💰", title: "Total Revenue", value: `₹${totalRevenue}`, color: "#f59e0b", trend: "+12% this month" }
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
              {stat.trend && <div className="stat-trend">{stat.trend}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h2>📈 Appointment Trends</h2>
          </div>
          <div className="card-body">
            <div className="chart-placeholder">
              <span className="chart-icon">📊</span>
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>🏥 Ward Occupancy</h2>
          </div>
          <div className="card-body">
            <div className="ward-summary">
              {wards.map(ward => (
                <div key={ward.WardID} className="ward-summary-item">
                  <span className="ward-name">{ward.WardName}</span>
                  <span className="ward-capacity">{ward.Capacity} beds</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Activity</h2>
        </div>
        <div className="card-body">
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <span>New patient registered - John Doe</span>
              <span className="activity-time">2 hours ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👨‍⚕️</span>
              <span>Dr. Smith added to Cardiology</span>
              <span className="activity-time">5 hours ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🏥</span>
              <span>Ward B assigned to Dr. Kumar</span>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== MANAGE DOCTORS VIEW ==========
function ManageDoctors() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [doctors] = useState([
    { id: 1, name: "Dr. Meera Sharma", specialization: "Cardiology", contact: "9999999999", email: "meera@hospital.com", patients: 45 },
    { id: 2, name: "Dr. Rajesh Kumar", specialization: "Neurology", contact: "8888888888", email: "rajesh@hospital.com", patients: 38 }
  ]);

  return (
    <div className="doctors-container">
      <div className="page-header">
        <h1 className="page-title">👨‍⚕️ Manage Doctors</h1>
        <button className="primary-btn" onClick={() => setShowAddForm(true)}>
          ➕ Add New Doctor
        </button>
      </div>

      <div className="card">
        <div className="card-body no-padding">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Patients</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doctor-cell">
                        <div className="doctor-avatar-small">{doc.name.charAt(3)}</div>
                        <span>{doc.name}</span>
                      </div>
                    </td>
                    <td>{doc.specialization}</td>
                    <td>{doc.contact}</td>
                    <td>{doc.email}</td>
                    <td>{doc.patients}</td>
                    <td>
                      <button className="action-btn-small">Edit</button>
                      <button className="action-btn-small delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddDoctorModal onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}

// ========== MANAGE PATIENTS VIEW ==========
function ManagePatients() {
  const [patients] = useState([
    { id: 1, name: "John Doe", age: 45, gender: "Male", contact: "9876543210", lastVisit: "2025-10-20" },
    { id: 2, name: "Jane Smith", age: 32, gender: "Female", contact: "9876543211", lastVisit: "2025-10-22" }
  ]);

  return (
    <div className="patients-container">
      <div className="page-header">
        <h1 className="page-title">👥 Manage Patients</h1>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search patients..." />
        </div>
      </div>

      <div className="card">
        <div className="card-body no-padding">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Last Visit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="patient-cell">
                        <div className="patient-avatar-small">{patient.name.charAt(0)}</div>
                        <span>{patient.name}</span>
                      </div>
                    </td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.contact}</td>
                    <td>{formatDate(patient.lastVisit)}</td>
                    <td>
                      <button className="action-btn-small">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== APPOINTMENTS VIEW ==========
function AllAppointments({ appointments }) {
  return (
    <div className="appointments-container">
      <h1 className="page-title">📅 All Appointments</h1>

      <div className="card">
        <div className="card-body no-padding">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.AppointmentID}>
                    <td>{formatDate(apt.AppointmentDate)}</td>
                    <td>{formatTime(apt.StartTime)}</td>
                    <td>{apt.PatientName}</td>
                    <td>Dr. {apt.DoctorName || "Unknown"}</td>
                    <td>
                      <span className={`status-badge ${apt.Status.toLowerCase()}`}>
                        {apt.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== WARD MANAGEMENT VIEW ==========
function WardManagement({ wards, reload }) {
  const [showAssignForm, setShowAssignForm] = useState(false);

  return (
    <div className="wards-container">
      <div className="page-header">
        <h1 className="page-title">🏥 Ward Management</h1>
        <button className="primary-btn" onClick={() => setShowAssignForm(true)}>
          ➕ Assign Patient to Ward
        </button>
      </div>

      <div className="wards-grid">
        {wards.map(ward => {
          const occupancy = ward.AssignedDoctor ? 70 : 30;
          const color = occupancy > 80 ? "#ef4444" : occupancy > 50 ? "#f59e0b" : "#10b981";
          
          return (
            <div key={ward.WardID} className="ward-card" style={{ borderLeftColor: color }}>
              <div className="ward-header">
                <h3>{ward.WardName}</h3>
                <span className="ward-icon">🏥</span>
              </div>
              <div className="ward-info">
                <div className="info-row">
                  <span className="info-label">Capacity:</span>
                  <span className="info-value">{ward.Capacity} beds</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Occupancy:</span>
                  <span className="info-value" style={{ color }}>{occupancy}%</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Assigned Doctor:</span>
                  <span className="info-value">{ward.AssignedDoctor || "None"}</span>
                </div>
              </div>
              <button className="btn-ward-action">Manage Ward</button>
            </div>
          );
        })}
      </div>

      {showAssignForm && (
        <AssignWardModal onClose={() => setShowAssignForm(false)} reload={reload} />
      )}
    </div>
  );
}

// ========== BILLING MANAGEMENT VIEW ==========
function BillingManagement() {
  const [showGenerateForm, setShowGenerateForm] = useState(false);

  return (
    <div className="billing-container">
      <div className="page-header">
        <h1 className="page-title">💰 Billing & Revenue</h1>
        <button className="primary-btn" onClick={() => setShowGenerateForm(true)}>
          ➕ Generate Bill
        </button>
      </div>

      <div className="billing-stats">
        <div className="billing-stat-card">
          <span className="billing-stat-label">Total Revenue</span>
          <span className="billing-stat-value">₹125,000</span>
        </div>
        <div className="billing-stat-card pending">
          <span className="billing-stat-label">Pending Payments</span>
          <span className="billing-stat-value">₹25,000</span>
        </div>
        <div className="billing-stat-card">
          <span className="billing-stat-label">Collected Today</span>
          <span className="billing-stat-value">₹8,500</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Bills</h2>
        </div>
        <div className="card-body no-padding">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#BL001</td>
                  <td>John Doe</td>
                  <td>{formatDate(new Date())}</td>
                  <td>₹2,500</td>
                  <td><span className="status-badge pending">Pending</span></td>
                  <td><button className="action-btn-small">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showGenerateForm && (
        <GenerateBillModal onClose={() => setShowGenerateForm(false)} />
      )}
    </div>
  );
}

// ========== MODALS ==========
function AddDoctorModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "", specialization: "", contact: "", email: "", password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register/doctor", {
        Name: formData.name,
        Specialization: formData.specialization,
        Contact: formData.contact,
        Email: formData.email,
        Password: formData.password
      });
      alert("Doctor added successfully!");
      onClose();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to add doctor"));
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="Add New Doctor">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Specialization</label>
          <input type="text" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Contact</label>
            <input type="tel" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Add Doctor</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

function AssignWardModal({ onClose, reload }) {
  const [formData, setFormData] = useState({ wardId: "", patientId: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/wards/assign", {
        wardId: formData.wardId,
        patientId: formData.patientId
      });
      alert("Patient assigned to ward successfully!");
      reload();
      onClose();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to assign"));
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="Assign Patient to Ward">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Ward ID</label>
          <input type="number" value={formData.wardId} onChange={(e) => setFormData({...formData, wardId: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Patient ID</label>
          <input type="number" value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})} required />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Assign</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

function GenerateBillModal({ onClose }) {
  const [formData, setFormData] = useState({ patientId: "", amount: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/billing/generate", {
        patientId: formData.patientId,
        amount: formData.amount
      });
      alert("Bill generated successfully!");
      onClose();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to generate bill"));
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="Generate Bill">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Patient ID</label>
          <input type="number" value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Generate Bill</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

function ModalWrapper({ onClose, title, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        {children}
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