import { useMemo } from 'react';

const dummyNotifications = [
  {
    id: 1,
    title: 'New message from Admin',
    message: 'Please review the updated policy documents.',
    date: '2025-07-23T14:30:00Z',
  },
  {
    id: 2,
    title: 'System Maintenance',
    message: 'Scheduled downtime on 25th July from 1 AM to 3 AM.',
    date: '2025-07-20T10:00:00Z',
  },
  {
    id: 3,
    title: 'Profile Updated',
    message: 'Your profile information has been updated successfully.',
    date: '2025-07-21T16:45:00Z',
  },
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function NotificationPage() {
  const notifications = useMemo(() => {
    return [...dummyNotifications].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>

      <div className="space-y-4">
        {notifications.map((note) => (
          <div
            key={note.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-5"
          >
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {note.title}
              </h2>
              <span className="text-xs text-gray-400">
                {formatDate(note.date)}
              </span>
            </div>
            <p className="text-sm text-gray-700">{note.message}</p>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-gray-500 text-center">No notifications found.</p>
        )}
      </div>
    </div>
  );
}
