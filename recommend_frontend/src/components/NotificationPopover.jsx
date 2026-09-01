import { useState, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import apiClient from '../api/client';

function NotificationPopover({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Initial fetch
    apiClient.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(err => console.error("Erreur notifs", err));

    // 2. WebSocket listener for real-time notifications
    if (user && (user.id || user._id)) {
      const ws = new WebSocket(`ws://localhost:8000/chat/ws/${user.id || user._id}`);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Assuming data is a message or notification object
          setNotifications(prev => [
            { message: `Nouveau message de ${data.sender_id || 'quelqu\'un'}` },
            ...prev
          ]);
        } catch(e) {
          console.error(e);
        }
      };

      return () => ws.close();
    }
  }, [user]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-600 hover:text-yellow-500 transition"
      >
        <FiBell size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-zinc-100 z-50">
          <div className="p-4 border-b font-bold text-black">Notifications</div>
          <div className="max-h-60 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-zinc-500 text-sm">Aucune notification.</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="p-3 border-b border-zinc-50 last:border-0 hover:bg-yellow-50 rounded-lg cursor-pointer transition">
                  <p className="text-sm font-medium text-black">{n.message}</p>
                  <p className="text-xs text-zinc-400 mt-1">À l'instant</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPopover;
