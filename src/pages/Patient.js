// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function PatientDashboard() {
//   const [appointments, setAppointments] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [token, setToken] = useState("");
//   const [form, setForm] = useState({
//     doctorId: "",
//     date: "",
//     startTime: "",
//     endTime: "",
//     reason: "",
//   });

//   useEffect(() => {
//     const t = localStorage.getItem("token");
//     setToken(t);
//     if (t) {
//       fetchAppointments(t);
//       fetchDoctors();
//     }
//   }, []);

//   const fetchAppointments = async (t) => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/appointments/patient/my", {
//         headers: { Authorization: `Bearer ${t}` },
//       });
//       setAppointments(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchDoctors = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/doctors/all");
//       setDoctors(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/appointments/book", form, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       alert(res.data.message);
//       fetchAppointments(token);
//     } catch (err) {
//       alert(err.response?.data?.message || "Error booking appointment");
//     }
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Patient Dashboard</h2>

//       <h3>Book Appointment</h3>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Doctor:
//           <select name="doctorId" onChange={handleChange} required>
//             <option value="">-- Select Doctor --</option>
//             {doctors.map((d) => (
//               <option key={d.DoctorID} value={d.DoctorID}>
//                 {d.Name} ({d.Specialization})
//               </option>
//             ))}
//           </select>
//         </label>
//         <br />
//         <label>
//           Date:
//           <input type="date" name="appointmentDate" onChange={handleChange} required />
//         </label>
//         <br />
//         <label>
//           Start Time:
//           <input type="time" name="startTime" onChange={handleChange} required />
//         </label>
//         <br />
//         <label>
//           End Time:
//           <input type="time" name="endTime" onChange={handleChange} required />
//         </label>
//         <br />
//         <label>
//           Reason:
//           <input type="text" name="reason" onChange={handleChange} placeholder="Optional" />
//         </label>
//         <br />
//         <button type="submit">Book Appointment</button>
//       </form>

//       <h3 style={{ marginTop: "2rem" }}>My Appointments</h3>
//       {appointments.length === 0 ? (
//         <p>No appointments yet.</p>
//       ) : (
//         <table border="1" cellPadding="10">
//           <thead>
//             <tr>
//               <th>Doctor</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Reason</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {appointments.map((a) => (
//               <tr key={a.AppointmentID}>
//                 <td>{a.DoctorName}</td>
//                 <td>{a.AppointmentDate}</td>
//                 <td>{a.StartTime} - {a.EndTime}</td>
//                 <td>{a.Reason}</td>
//                 <td>{a.Status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Patient.css"; 

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState("");
  const [form, setForm] = useState({
    doctorId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    reason: "",
  });
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [booking, setBooking] = useState(false);
  const [modal, setModal] = useState({ visible: false, title: "", message: "", onConfirm: null });

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) {
      fetchDoctors();
      fetchAppointments(t);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors/all");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load doctors");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchAppointments = async (t) => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments/patient/my", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load appointments");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      const res = await axios.post("http://localhost:5000/api/appointments/book", form, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setModal({ visible: true, title: "Success", message: res.data.message, onConfirm: () => setModal({ ...modal, visible: false }) });
      fetchAppointments(token);
      setForm({ doctorId: "", appointmentDate: "", startTime: "", endTime: "", reason: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error booking appointment");
    } finally {
      setBooking(false);
    }
  };

  const cancelAppointment = (id) => {
    setModal({
      visible: true,
      title: "Confirm Cancellation",
      message: "Are you sure you want to cancel this appointment?",
      onConfirm: async () => {
        try {
          await axios.put(`http://localhost:5000/api/appointments/${id}/cancel`, null, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Appointment cancelled");
          fetchAppointments(token);
        } catch (err) {
          alert(err.response?.data?.message || "Failed to cancel appointment");
        }
        setModal({ ...modal, visible: false });
      },
    });
  };

  const logout = () => {
    setModal({
      visible: true,
      title: "Confirm Logout",
      message: "Are you sure you want to logout?",
      onConfirm: () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      },
    });
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [h, m] = timeString.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      completed: "status-completed",
      cancelled: "status-cancelled",
    };
    const cls = colors[status?.toLowerCase()] || colors.pending;
    return <span className={`status-badge ${cls}`}>{status || "Pending"}</span>;
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>TEAM UTPA</h2>
        <nav>
          <button className="active">Patients</button>
        </nav>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header>
          <h1>Patient Dashboard</h1>
        </header>

        <div className="content-grid">
          {/* Appointment Form */}
          <div className="appointment-form-container">
            <h2>Book New Appointment</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Doctor
                <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
                  <option value="">-- Select Doctor --</option>
                  {loadingDoctors ? <option>Loading...</option> : doctors.map((d) => (
                    <option key={d.DoctorID} value={d.DoctorID}>{d.Name} ({d.Specialization})</option>
                  ))}
                </select>
              </label>
              <label>
                Date
                <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} required />
              </label>
              <label>
                Start Time
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
              </label>
              <label>
                End Time
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
              </label>
              <label>
                Reason (Optional)
                <input type="text" name="reason" value={form.reason} onChange={handleChange} placeholder="Reason for appointment" />
              </label>
              <button type="submit" disabled={booking}>{booking ? "Booking..." : "Book Appointment"}</button>
            </form>
          </div>

          {/* Appointments Table */}
          <div className="appointments-table-container">
            <h2>My Appointments</h2>
            {loadingAppointments ? (
              <p>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p>No appointments yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.AppointmentID}>
                      <td>{formatDate(a.AppointmentDate)}</td>
                      <td>{formatTime(a.StartTime)} - {formatTime(a.EndTime)}</td>
                      <td>{a.DoctorName}</td>
                      <td>{a.Reason || "N/A"}</td>
                      <td>{getStatusBadge(a.Status)}</td>
                      <td>
                        {a.Status?.toLowerCase() === "pending" ? (
                          <button onClick={() => cancelAppointment(a.AppointmentID)} className="cancel-btn">Cancel</button>
                        ) : (
                          <button disabled className="disabled-btn">---</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal */}
        {modal.visible && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{modal.title}</h3>
              <p>{modal.message}</p>
              <div className="modal-actions">
                <button onClick={() => setModal({ ...modal, visible: false })}>Cancel</button>
                {modal.onConfirm && <button onClick={modal.onConfirm}>Confirm</button>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
