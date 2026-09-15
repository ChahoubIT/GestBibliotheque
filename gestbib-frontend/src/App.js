import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [subscriberId, setSubscriberId] = useState('');
  const [isbn, setIsbn] = useState('');
  const [borrowId, setBorrowId] = useState('');
  const [wearStatus, setWearStatus] = useState('OK');
  const [message, setMessage] = useState('');
  const [penaltyResult, setPenaltyResult] = useState(null);

  // Gestion de l'emprunt
  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3003/api/borrows', {
        subscriber_id: subscriberId,
        book_isbn: isbn
      });
      setMessage(`Emprunt réussi ! Date limite de retour: ${new Date(res.data.expectedReturnDate).toLocaleDateString()}`);
      setPenaltyResult(null);
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur lors de l'emprunt");
    }
  };

  // Gestion du retour
  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3003/api/borrows/${borrowId}/return`, {
        wear_status: wearStatus
      });
      setPenaltyResult(res.data);
      setMessage("Retour enregistré !");
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur lors du retour");
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>📚 Application GestBib</h1>
      
      {message && (
        <div style={{ background: '#e0f7fa', color: '#006064', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Formulaire Emprunt */}
        <div style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px' }}>
          <h2>Effectuer un Emprunt</h2>
          <form onSubmit={handleBorrow}>
            <div style={{ marginBottom: '15px' }}>
              <label>ID Abonné :</label>
              <input type="number" value={subscriberId} onChange={e => setSubscriberId(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>ISBN du Livre :</label>
              <input type="text" value={isbn} onChange={e => setIsbn(e.target.value)} required />
            </div>
            <button type="submit" style={{ width: '100%' }}>Valider l'emprunt</button>
          </form>
        </div>

        {/* Formulaire Retour */}
        <div style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px' }}>
          <h2>Retourner un Livre</h2>
          <form onSubmit={handleReturn}>
            <div style={{ marginBottom: '15px' }}>
              <label>ID d'Emprunt :</label>
              <input type="number" value={borrowId} onChange={e => setBorrowId(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>État du Livre :</label>
              <select value={wearStatus} onChange={e => setWearStatus(e.target.value)}>
                <option value="OK">Bon État</option>
                <option value="TORN_WEAR">Déchiré / Usé (Pénalité 75%)</option>
                <option value="DESTROYED">Complètement usé (Remboursement total)</option>
              </select>
            </div>
            <button type="submit" style={{ width: '100%' }}>Valider le retour</button>
          </form>

          {penaltyResult && (
            <div style={{ marginTop: '20px', background: '#fff3e0', border: '1px solid #ffe0b2', padding: '12px', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#e65100' }}>Détails des Pénalités :</h4>
              <p style={{ margin: '5px 0' }}>Pénalité de retard : {penaltyResult.latenessPenalty.toFixed(2)} €</p>
              <p style={{ margin: '5px 0' }}>Pénalité d'usure : {penaltyResult.wearPenalty.toFixed(2)} €</p>
              <strong style={{ color: '#b71c1c' }}>Total à payer : {penaltyResult.totalPenalty.toFixed(2)} €</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
