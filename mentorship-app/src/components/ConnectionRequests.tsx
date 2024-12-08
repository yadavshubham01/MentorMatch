import { useEffect, useState } from 'react';

const ConnectionRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('http://localhost:5000/api/connections/requests', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch connection requests');
        }

        const data = await response.json();
        setRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleResponse = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/connections/${status}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to respond to request');
      }

      // Remove the request from the state
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Connection Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No new connection requests</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id} className="border p-4 mb-2">
              <p>{request.sender.name} sent you a connection request.</p>
              <div className="mt-2">
                <button
                  onClick={() => handleResponse(request.id, 'accepted')}
                  className="mr-2 bg-sky-400 text-white px-3 py-1 rounded hover:bg-sky-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleResponse(request.id, 'rejected')}
                  className="bg-black text-white px-3 py-1 rounded hover:bg-neutral-950"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConnectionRequests;
