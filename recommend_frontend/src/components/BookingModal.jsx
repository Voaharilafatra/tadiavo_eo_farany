import { useState } from 'react';
import { FiCalendar, FiClock, FiX } from 'react-icons/fi';
import api from '../api/api';
import Swal from 'sweetalert2';

function BookingModal({ provider, isOpen, onClose }) {
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !date || !time) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    try {
      const scheduled_at = new Date(`${date}T${time}:00Z`).toISOString();
      await apiClient.post('/bookings', {
        provider_id: provider.id || provider._id,
        service_id: selectedService,
        scheduled_at,
        notes
      });
      Swal.fire('Succès', 'Votre demande de réservation a été envoyée !', 'success');
      onClose();
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de réserver pour le moment.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">Réserver un service</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-black">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Service</label>
            <select 
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Sélectionnez un service</option>
              {provider.services?.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.price?.avg} {s.price?.currency}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1"><FiCalendar className="inline" /> Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border p-3" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1"><FiClock className="inline" /> Heure</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border p-3" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Notes pour le prestataire</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border p-3" rows="3"></textarea>
          </div>

          <button type="submit" className="w-full rounded-full bg-yellow-400 py-3 font-bold text-white hover:bg-yellow-500">
            Confirmer la réservation
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;