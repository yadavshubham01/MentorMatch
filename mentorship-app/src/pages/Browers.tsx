import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
const APIURL = import.meta.env.VITE_API_URL;
const BrowseUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [interestFilter, setInterestFilter] = useState<string>('');
  
  // Function to send a connection request to the receiver
  const sendRequest = async (receiverId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
     
      const response = await fetch(`${APIURL}/api/connections/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send connection request');
      }

      alert('Connection request sent successfully!');
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const queryParams = new URLSearchParams();
        if (roleFilter) queryParams.append('role', roleFilter);
        if (skillFilter) queryParams.append('skills', skillFilter);
        if (interestFilter) queryParams.append('interests', interestFilter);

        const response = await fetch(`${APIURL}/api/users/users?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [roleFilter, skillFilter, interestFilter]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-semibold text-center mb-6">Browse User Profiles</h1>

        <div className="flex flex-wrap justify-between mb-6">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <label className="block text-sm font-medium mb-1">Filter by Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-[70%] p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="mentor">Mentor</option>
              <option value="mentee">Mentee</option>
            </select>
          </div>

          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <label className="block text-sm font-medium mb-1">Filter by Skill:</label>
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-[80%] p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter skill"
            />
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-1">Filter by Interest:</label>
            <input
              type="text"
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="w-[80%] p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter interest"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {users.map((user) => (
            <div key={user.id} className="p-4 border border-gray-200 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl bg-white">
              <h2 className="text-2xl font-semibold text-blue-700 mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-2">Role: <span className="font-medium">{user.role}</span></p>
              <p className="text-gray-600 mb-4">Bio: {user.bio || 'No bio available'}</p>
              
              <div className="mb-2">
                <strong className="block text-gray-700">Skills:</strong>
                <div className="flex flex-wrap">
                  {user.skills.map((skill: any, index: number) => (
                    <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 mr-2 mb-2 rounded-lg text-xs">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong className="block text-gray-700">Interests:</strong>
                <div className="flex flex-wrap">
                  {user.interests.map((interest: any, index: number) => (
                    <span key={index} className="inline-block bg-green-100 text-green-800 px-2 py-1 mr-2 mb-2 rounded-lg text-xs">
                      {interest.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => sendRequest(user.id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseUsers;
