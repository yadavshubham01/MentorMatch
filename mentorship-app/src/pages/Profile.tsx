import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/signin';
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId; // Adjust if the payload has a different key
        if (!userId) {
          console.error('User ID not found in token');
          return;
        }
        const userProfile = await getUserProfile(userId, token);
        setUser(userProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className='min-h-screen overflow-hidden'>
        <Navbar/>
    <div className="flex justify-center items-center min-h-screen bg-white">
      {user ? (
        <div className="max-w-md w-full bg-neutral-900 text-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center mb-4">
            <div className="h-16 w-16 bg-gray-300 text-white flex justify-center items-center rounded-full text-2xl font-bold">
              {user.name[0]?.toUpperCase()}
            </div>
            <h1 className="text-2xl font-semibold ml-4">{user.name}</h1>
          </div>
          <div className="mt-4">
            <div className="mb-2">
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div className="mb-2">
              <span className="font-medium">Role:</span> {user.role}
            </div>
            <div className="mb-2">
              <span className="font-medium">Bio:</span> {user.bio || 'No bio available'}
            </div>
            <div className="mb-4">
              <span className="font-medium">Skills:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skills?.length > 0 ? (
                  user.skills.map((skill: any, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-200 text-blue-800 rounded-lg text-sm"
                    >
                      {skill.name}
                    </span>
                  ))
                ) : (
                  <span>No skills listed</span>
                )}
              </div>
            </div>
            <div className="mb-4">
              <span className="font-medium">Interests:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.interests?.length > 0 ? (
                  user.interests.map((interest: any, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm"
                    >
                      {interest.name}
                    </span>
                  ))
                ) : (
                  <span>No interests listed</span>
                )}
              </div>
            </div>
          </div>
          <div className='flex justify-between'>
          <button
            onClick={() => window.location.href = '/edit-profile'}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={() => window.location.href = '/browser'}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Search User
          </button>
         </div> 
        </div>
      ) : (
        <p className="text-gray-600">Loading...</p>
      )}
    </div>
    </div>
  );
};

export default Profile;
