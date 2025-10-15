import React, { useEffect, useState } from "react";
import api from "../api";

export default function Admin() {
  const [wards, setWards] = useState([]);
  useEffect(() => {
    const load = async () => {
      const res = await api.get("/wards");
      setWards(res.data);
    };
    load();
  }, []);

  return (
    <div style={{ margin: 20 }}>
      <h2>Admin Dashboard</h2>
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
