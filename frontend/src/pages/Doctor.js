// import React, { useEffect, useState } from "react";
// import api from "../api";

// export default function Doctor() {
//   const [appointments, setAppointments] = useState([]);
//   const [wards, setWards] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const resA = await api.get("/appointments/doctor/my");
//       setAppointments(resA.data);
//       const resW = await api.get("/wards");
//       setWards(resW.data);
//     };
//     fetchData();
//   }, []);

//   return (
//     <div style={{ margin: 20 }}>
//       <h2>Doctor Dashboard</h2>
//       <h3>Appointments</h3>
//       <table border="1">
//         <thead>
//           <tr><th>Date</th><th>Start</th><th>End</th><th>Patient</th></tr>
//         </thead>
//         <tbody>
//           {appointments.map(a=>(
//             <tr key={a.AppointmentID}>
//               <td>{a.AppointmentDate}</td>
//               <td>{a.StartTime}</td>
//               <td>{a.EndTime}</td>
//               <td>{a.PatientName}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h3>Wards</h3>
//       <ul>
//         {wards.map(w=>(
//           <li key={w.WardID}>
//             {w.Type} — capacity {w.Capacity}, patient {w.AssignedPatientID || "none"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../api"; 
import "./Doctor.css"; // Import plain CSS

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingWards, setLoadingWards] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [h, m] = timeString.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 || 12;
    return `${display}:${m} ${ampm}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resA, resW] = await Promise.all([
          api.get("/appointments/doctor/my"),
          api.get("/wards"),
        ]);
        setAppointments(resA.data);
        setWards(resW.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoadingAppointments(false);
        setLoadingWards(false);
      }
    };
    fetchData();
  }, []);

  const groupWards = (wards) => {
    const wardTypes = {};
    wards.forEach((w) => {
      if (!wardTypes[w.Type]) {
        wardTypes[w.Type] = { capacity: 0, used: 0, patients: [] };
      }
      wardTypes[w.Type].capacity += w.Capacity || 0;
      if (w.AssignedPatientID) {
        wardTypes[w.Type].used += 1;
        wardTypes[w.Type].patients.push(w.AssignedPatientID);
      }
    });
    return wardTypes;
  };

  const getWardColorClass = (used, capacity) => {
    const percent = (used / capacity) * 100;
    if (percent >= 100) return "ward-red";
    if (percent >= 70) return "ward-yellow";
    if (percent > 0) return "ward-purple";
    return "ward-green";
  };

  const wardGroups = groupWards(wards);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            TEAM UTPA
          </div>
          <nav>
            <a href="#">🏠 Dashboard</a>
            <a href="#">🧍‍♂️ Patients</a>
            <a href="#">📅 Appointments</a>
            <a href="#" className="active">🩺 Doctors</a>
          </nav>
        </div>
        <div>
          <button className="logout-btn">🚪 Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>Doctor Dashboard</h1>
          <div className="doctor-info">
            <span>Dr. Jane Smith</span>
            <img
              src="https://placehold.co/100x100/A78BFA/ffffff?text=JS"
              alt="Doctor Avatar"
            />
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        <div className="grid">
          {/* Appointments */}
          <div className="card">
            <h2>Upcoming Appointments <span>View Calendar</span></h2>

            {loadingAppointments ? (
              <div className="text-center py-8">
                <div className="loading"></div>
                <p>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div>No appointments found.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Patient</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.AppointmentID}>
                      <td>{formatDate(a.AppointmentDate)}</td>
                      <td>{formatTime(a.StartTime)}</td>
                      <td>{formatTime(a.EndTime)}</td>
                      <td className="patient-name">{a.PatientName || "Unknown"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Wards */}
          <div className="card">
            <h2>Ward Capacity Overview</h2>
            {loadingWards ? (
              <div className="text-center py-8">
                <div className="loading"></div>
                <p>Loading wards...</p>
              </div>
            ) : wards.length === 0 ? (
              <div>No wards found.</div>
            ) : (
              <ul>
                {Object.entries(wardGroups).map(([type, data]) => {
                  const cls = getWardColorClass(data.used, data.capacity);
                  const full = data.used >= data.capacity;
                  return (
                    <li key={type} className={`ward-item ${cls}`}>
                      <div>
                        <span>{type}</span>
                        <span>{data.used} / {data.capacity} Beds {full && "(Full)"}</span>
                      </div>
                      <p>Patients: {data.patients.length > 0 ? data.patients.join(", ") : "None"}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
