import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState("");
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) {
      fetchAppointments(t);
      fetchDoctors();
    }
  }, []);

  const fetchAppointments = async (t) => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments/patient/my", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors/all");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/appointments/book", form, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      alert(res.data.message);
      fetchAppointments(token);
    } catch (err) {
      alert(err.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Patient Dashboard</h2>

      <h3>Book Appointment</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Doctor:
          <select name="doctorId" onChange={handleChange} required>
            <option value="">-- Select Doctor --</option>
            {doctors.map((d) => (
              <option key={d.DoctorID} value={d.DoctorID}>
                {d.Name} ({d.Specialization})
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Date:
          <input type="date" name="appointmentDate" onChange={handleChange} required />
        </label>
        <br />
        <label>
          Start Time:
          <input type="time" name="startTime" onChange={handleChange} required />
        </label>
        <br />
        <label>
          End Time:
          <input type="time" name="endTime" onChange={handleChange} required />
        </label>
        <br />
        <label>
          Reason:
          <input type="text" name="reason" onChange={handleChange} placeholder="Optional" />
        </label>
        <br />
        <button type="submit">Book Appointment</button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>My Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.AppointmentID}>
                <td>{a.DoctorName}</td>
                <td>{a.AppointmentDate}</td>
                <td>{a.StartTime} - {a.EndTime}</td>
                <td>{a.Reason}</td>
                <td>{a.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
