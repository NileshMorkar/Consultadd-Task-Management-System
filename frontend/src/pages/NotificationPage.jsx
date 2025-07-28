import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import MarkChatUnreadSharpIcon from '@mui/icons-material/MarkChatUnreadSharp';
import MarkChatReadSharpIcon from '@mui/icons-material/MarkChatReadSharp';
import Tooltip from '@mui/material/Tooltip';
import axiosInstance from '../axiosInstance';
import CustomSnackbar from '../components/CustomSnackBar';

const dummyNotifications = [
  {
    id: 1,
    title: 'New message from Admin',
    message: 'Please review the updated policy documents.',
    date: '2025-07-23T14:30:00Z',
    status: 1,
  },
  {
    id: 2,
    title: 'System Maintenance',
    message: 'Scheduled downtime on 25th July from 1 AM to 3 AM.',
    date: '2025-07-20T10:00:00Z',
    status: 0,
  },
  {
    id: 3,
    title: 'Profile Updated',
    message: '90fjks.  dbncjkbcj  ashcoac lkasncl Your profile information has been updated successfully.',
    date: '2025-07-21T16:45:00Z',
    status: 0,
  },
  {
    id: 1,
    title: 'New message from Admin',
    message: 'Please review the updated policy documents.',
    date: '2025-07-23T14:30:00Z',
    status: 1,
  }, {
    id: 1,
    title: 'New message from Admin',
    message: 'Please review the updated policy documents.',
    date: '2025-07-23T14:30:00Z',
    status: 1,
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

  const [isSnackbar, setIsSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const readMessages = [];
  const unreadMessages = [];
  const [isEmpty, setIsEmpty] = useState(false);


  useEffect(() => {

    const getAllNotiications = async () => {

      // const allNotifications = await axiosInstance.get("/notifications");

    }

    getAllNotiications();
  }, [])




  const handleOnRead = (id) => {
    console.log("mark As Read");
  }

  const handleMarkAllAsRead = () => {
    setIsSnackbar(true);
    setSnackbarMessage('All Messages Are Read !!');

    console.log("Mark All As read");
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className='flex justify-between'>
          <h1 className="text-white text-3xl font-bold  mb-6">Notifications</h1>
          <Button onClick={handleMarkAllAsRead} variant="contained" className='h-10'>Mark All As Read</Button>
        </div>

        <div className="space-y-4">
          {dummyNotifications.map((note) => (
            <>
              <div>

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
                  <p className="text-sm text-gray-700 mb-4">{note.message}</p>


                  <Tooltip title="Mark As Read">
                    <Button onClick={handleOnRead} variant="contained" className='mt-10 h-8'><MarkChatUnreadSharpIcon /></Button>
                  </Tooltip>



                </div>

              </div>
            </>
          ))}
        </div>

        {/* Read Messages */}
        <div className="mt-4 space-y-4">
          {unreadMessages.map((note) => (
            <>
              <div>

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
                  <p className="text-sm text-gray-700 mb-4">{note.message}</p>

                  <Button disabled onClick={handleOnRead} variant="contained" className='mt-10 h-8'><MarkChatReadSharpIcon /></Button>

                </div>

              </div>
            </>
          ))}
        </div>

        {isEmpty && (
          <p className="text-gray-500 text-center">No notifications found.</p>
        )}
      </div>


      {/* All Read snackbar messages */}

      <CustomSnackbar open={isSnackbar} message={snackbarMessage} onClose={() => { setIsSnackbar(false); setSnackbarMessage(''); }} />

    </>
  );
}
