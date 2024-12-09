import { useState, useEffect } from 'react';
const APIURL = import.meta.env.VITE_API_URL;

export const NotificationCard = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch(`${APIURL}/api/nsg`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${APIURL}/api/read/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

     
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${APIURL}/api/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications ">
      <h2 className="text-2xl font-semibold mb-4 pl-2 ">Notifications</h2>
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className='pl-2'>No notifications</p>
      ) : (
        <ul className='w-full '>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 mb-2 border rounded ${
                notification.read ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <p>{notification.content}</p>
              <div className="mt-2 flex justify-end">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mr-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
               
              </div>
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
};


