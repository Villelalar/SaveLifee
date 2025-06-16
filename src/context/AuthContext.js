import React, { createContext, useContext, useState, useEffect } from 'react';

// User types
export const USER_TYPES = {
  CLIENT: 'client',
  CAREGIVER: 'caregiver',
  RESPONSIBLE: 'responsible'
};

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('savelife_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('savelife_user', JSON.stringify(userData));
    return true;
  };

  // Register function
  const register = (userData) => {
    // In a real app, this would make an API call to create the user
    // For now, we'll simulate storing in localStorage
    const users = JSON.parse(localStorage.getItem('savelife_users') || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      return { success: false, message: 'Email already in use' };
    }
    
    // Add user to "database"
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('savelife_users', JSON.stringify(users));
    
    // Auto login after registration
    login(newUser);
    
    return { success: true, user: newUser };
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('savelife_user');
  };

  // Check if user exists (for login)
  const authenticateUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem('savelife_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Don't store password in current user state
      const { password, ...userWithoutPassword } = user;
      login(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  // Get users by type
  const getUsersByType = (userType) => {
    const users = JSON.parse(localStorage.getItem('savelife_users') || '[]');
    return users.filter(user => user.userType === userType);
  };

  // Get users by responsible ID (for caregivers)
  const getUsersByResponsibleId = (responsibleId) => {
    const users = JSON.parse(localStorage.getItem('savelife_users') || '[]');
    return users.filter(user => user.responsibleId === responsibleId);
  };

  // Link caregiver to responsible
  const linkCaregiverToResponsible = (caregiverId, responsibleId) => {
    const users = JSON.parse(localStorage.getItem('savelife_users') || '[]');
    const updatedUsers = users.map(user => {
      if (user.id === caregiverId) {
        return { ...user, responsibleId };
      }
      return user;
    });
    
    localStorage.setItem('savelife_users', JSON.stringify(updatedUsers));
    
    // Update current user if needed
    if (currentUser && currentUser.id === caregiverId) {
      const updatedUser = { ...currentUser, responsibleId };
      setCurrentUser(updatedUser);
      localStorage.setItem('savelife_user', JSON.stringify(updatedUser));
    }
    
    return true;
  };

  const value = {
    currentUser,
    userType: currentUser?.userType || null,
    loading,
    login,
    register,
    logout,
    authenticateUser,
    getUsersByType,
    getUsersByResponsibleId,
    linkCaregiverToResponsible,
    USER_TYPES
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
