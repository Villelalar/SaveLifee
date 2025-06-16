import React, { useEffect, useRef } from 'react';
import { useMedication } from '../context/MedicationContext';
import { checkUpcomingMedications, clearAllReminders } from '../services/NotificationService';

// This component doesn't render anything, it just runs the notification check periodically
const NotificationChecker = () => {
  const { medications, checkMedicationTaken } = useMedication();
  const checkIntervalRef = useRef(null);

  useEffect(() => {
    // Check for upcoming medications immediately on mount
    checkUpcomingMedications(medications, checkMedicationTaken);
    
    // Then set up an interval to check every minute
    checkIntervalRef.current = setInterval(() => {
      checkUpcomingMedications(medications, checkMedicationTaken);
    }, 60000); // Check every minute
    
    // Clean up interval on unmount
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      // Clear any active reminders
      clearAllReminders();
    };
  }, [medications]);

  // This component doesn't render anything
  return null;
};

export default NotificationChecker;
