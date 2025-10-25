import db from '../db.js';

export const assignWard = (req, res) => {
  const { wardId, patientId } = req.body;
  const query = 'UPDATE Ward SET AssignedPatientID = ? WHERE WardID = ?';
  db.query(query, [patientId, wardId], err => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ message: 'Patient assigned to ward' });
  });
};
