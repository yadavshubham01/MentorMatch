import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/api';
import {jwtDecode} from 'jwt-decode';

interface Skill {
  id: string;
  name: string;
  userId: string;
}

interface Interest {
  id: string;
  name: string;
}

interface Profile {
  name: string;
  role: string;
  bio: string;
  skills: Skill[]; 
  interests: Interest[]; 
}

const EditProfile = () => {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    role: '',
    bio: '',
    skills: [],
    interests: [] ,
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [decodedToken, setDecodedToken] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        setDecodedToken(decodedToken)
        const userId = decodedToken.userId;
        const userProfile = await getUserProfile(userId, token);
        setProfile({
          ...userProfile,
          skills: (userProfile.skills || []).map((skill: any) => ({
            id: skill.id,
            name: skill.name,
            userId: skill.userId,
          })),
          interests: (userProfile.interests || []).map((interest: any) => ({
            id: interest.id,
            name: interest.name,
          })),
          });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (
      trimmedSkill &&
      !profile.skills.some((skill) => skill.name.toLowerCase() === trimmedSkill.toLowerCase())
    ) {
      const newSkillObject = { id: Date.now().toString(), name: trimmedSkill, userId: decodedToken.userId }; // Replace 'userId' dynamically if needed
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkillObject],
      });
      setNewSkill(''); 
    }
  };
  
  const handleAddInterest = () => {
    const trimmedInterest = newInterest.trim();
    if (
      trimmedInterest &&
      !profile.interests.some((interest) => interest.name.toLowerCase() === trimmedInterest.toLowerCase())
    ) {
      const newInterestObject = { id: Date.now().toString(), name: trimmedInterest }; 
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterestObject],
      });
      setNewInterest(''); 
    }
  };
  

  const handleRemoveSkill = (skill: Skill) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };

  const handleRemoveInterest = (interest: Interest) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter((i) => i !== interest),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('You must be logged in to update your profile.');
      return;
    }

    try {
     const updatedProfile = await updateUserProfile(token, profile);
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
      setProfile(updatedProfile);
      navigate('/profile')
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
        {errorMessage && (
          <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={profile.role || ''}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Role</option>
              <option value="mentor">Mentor</option>
              <option value="mentee">Mentee</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Skills</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Add a new skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="flex items-center gap-2 px-2 py-1 bg-gray-200 rounded text-sm"
                >
                   {skill.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Interests</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Add a new interest"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest.id}
                  className="flex items-center gap-2 px-2 py-1 bg-gray-200 rounded text-sm"
                >
                  {interest.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-slate-950 text-white py-2 rounded hover:bg-slate-800 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
