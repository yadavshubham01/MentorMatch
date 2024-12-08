export const getUserProfile = async (id: number, token: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('An error occurred while fetching the profile. Please try again later.');
    }
  };

  export const updateUserProfile = async (token: string, profileData: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update user profile: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('An error occurred while updating the profile. Please try again later.');
    }
  };
  
  
  export const getMatches = async (userId: number, token: string) => {
    const response = await fetch(`http://localhost:5000/api/matches/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  };
  
  export const getNotifications = async (userId: number, token: string) => {
    const response = await fetch(`http://localhost:5000/api/nsg/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  };
  