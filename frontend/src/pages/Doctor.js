import React, { useEffect, useState } from "react";
import api from "../api";

export default function Doctor() {
  const [appointments, setAppointments] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resA = await api.get("/appointments/doctor/my");
      setAppointments(resA.data);
      const resW = await api.get("/wards");
      setWards(resW.data);
    };
    fetchData();
  }, []);

  return (
    <div style={{ margin: 20 }}>
      <h2>Doctor Dashboard</h2>
      <h3>Appointments</h3>
      <table border="1">
        <thead>
          <tr><th>Date</th><th>Start</th><th>End</th><th>Patient</th></tr>
        </thead>
        <tbody>
          {appointments.map(a=>(
            <tr key={a.AppointmentID}>
              <td>{a.AppointmentDate}</td>
              <td>{a.StartTime}</td>
              <td>{a.EndTime}</td>
              <td>{a.PatientName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Wards</h3>
      <ul>
        {wards.map(w=>(
          <li key={w.WardID}>
            {w.Type} — capacity {w.Capacity}, patient {w.AssignedPatientID || "none"}
          </li>
        ))}
      </ul>
    </div>
  );
}
