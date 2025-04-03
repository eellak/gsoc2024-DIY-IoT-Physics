import axios from 'axios';

const TB_BASE_URL = 'https://demo.thingsboard.io/api';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrc2F1cnlhMDAwNEBnbWFpbC5jb20iLCJ1c2VySWQiOiI3NDU2N2Y2MC00NWNlLTExZWYtOTFhYS00YjViODU3YmVmYmMiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6ImFiODEzNDlkLTQyNmYtNGQ3OC1hYTRjLTVmMWNiNjRmNWM4MyIsImV4cCI6MTc0MjIwNTk2MSwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE3NDA0MDU5NjEsImZpcnN0TmFtZSI6Ik1hbnUiLCJsYXN0TmFtZSI6IkRldiIsImVuYWJsZWQiOnRydWUsInByaXZhY3lQb2xpY3lBY2NlcHRlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjcyZDAyZDgwLTQ1Y2UtMTFlZi05MWFhLTRiNWI4NTdiZWZiYyIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAifQ.xIKzIcZWtEghrrI_h1sHYRkNdtKx1fwzUOOJ4TzzFIqi62icx0HqIJHnMaquBbgxx03OojEbO1DemGXv0fwFQg';

const headers = {
  'Content-Type': 'application/json',
  'X-Authorization': AUTH_TOKEN
};

export const generateTemporaryUser = async (email, slotId) => {
  try {
    const tempUsername = `temp_${slotId}_${Date.now()}`;
    const password = Math.random().toString(36).slice(-8);
    
    // Create customer user
    const response = await axios.post(
      `${TB_BASE_URL}/user`,
      {
        email,
        password,
        firstName: 'Temporary',
        lastName: 'User',
        additionalInfo: {
          description: 'Temporary user for IoT lab access',
          slotId,
          isTemporary: true,
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      },
      { headers }
    );

    if (!response.data || !response.data.id) {
      throw new Error('Invalid response from ThingsBoard API');
    }

    const userId = response.data.id.id;

    // Assign the user to your customer ID from the JWT token
    await axios.post(
      `${TB_BASE_URL}/customer/138140001dd211b2808080808080808080/user/${userId}`,
      {},
      { headers }
    );

    return {
      username: email, // uses email as username
      password,
      userId
    };
  } catch (error) {
    console.error('Failed to generate temporary user:', error);
    throw new Error('Failed to generate temporary ThingsBoard credentials');
  }
};

export const deleteTemporaryUser = async (userId) => {
  try {
    await axios.delete(`${TB_BASE_URL}/user/${userId}`, { headers });
  } catch (error) {
    console.error('Failed to delete temporary user:', error);
    throw new Error('Failed to delete temporary ThingsBoard user');
  }
};

// Get user credentials
export const getUserCredentials = async (userId) => {
  try {
    const response = await axios.get(`${TB_BASE_URL}/user/${userId}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Failed to get user credentials:', error);
    throw new Error('Failed to get ThingsBoard user credentials');
  }
};
