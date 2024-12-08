import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import {jwtDecode} from 'jwt-decode';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/signin';
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;
        if (!userId) {
          console.error('User ID not found in token');
          return;
        }
        const profileResponse = await getUserProfile(userId, token);
        setUser(profileResponse);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          window.location.href = '/signin';
          return;
        }

        const response = await fetch('http://localhost:5000/api/matches', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        setMatches(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const sendConnectionRequest = async (receiverId: number) => {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        {user ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-800">Hello, {user.name}</h1>
            </div>
            <div className="container mx-auto px-4">
              <h1 className="text-2xl font-semibold text-gray-700 mb-6">Potential Mentorship Matches</h1>

              {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
              ) : matches.length === 0 ? (
                <div className="text-center text-gray-600">
                  No matches found. Try updating your profile to increase match chances.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg duration-300 transition-transform transform hover:scale-105 hover:shadow-2xl"
                    >
                      <h2 className="text-xl font-semibold text-gray-800">{match.name}</h2>
                      <p className="mt-2 text-gray-600">Role: {match.role}</p>
                      <p className="mt-2 text-gray-600">Bio: {match.bio || 'No bio available'}</p>
                      <div className="mt-2">
                        <strong className="text-gray-700">Skills:</strong>
                        <div className="mt-1 flex flex-wrap">
                          {match.skills.map((skill: any, index: number) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-100 text-blue-700 px-3 py-1 m-1 rounded-full text-sm"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2">
                        <strong className="text-gray-700">Interests:</strong>
                        <div className="mt-1 flex flex-wrap">
                          {match.interests.map((interest: any, index: number) => (
                            <span
                              key={index}
                              className="inline-block bg-green-100 text-green-700 px-3 py-1 m-1 rounded-full text-sm"
                            >
                              {interest.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => sendConnectionRequest(match.id)}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
