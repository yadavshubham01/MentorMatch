import { useState } from 'react';

const SendConnectionRequest = () => {
  const [receiverId, setReceiverId] = useState<number | string>('');

  const sendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/connections/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId: Number(receiverId) }),
      });

      if (!response.ok) {
        throw new Error('Failed to send connection request');
      }

      alert('Connection request sent successfully!');
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Send Connection Request</h2>
      <input
        type="number"
        placeholder="Enter receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        className="p-2 border rounded mb-2"
      />
      <button
        onClick={sendRequest}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Connect
      </button>
    </div>
  );
};

export default SendConnectionRequest;
