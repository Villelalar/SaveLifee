import { toast } from 'react-toastify';
import translations from '../utils/translations';

// Store for active medication reminders
const activeReminders = new Map();

// Custom toast styles
const toastOptions = {
  position: "top-right",
  autoClose: 8000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Persistent medication reminder notification that can't be dismissed
export const showMedicationReminder = (medication) => {
  const { id, name, dosage, unit } = medication;
  
  // Check if we already have an active reminder for this medication
  if (activeReminders.has(id)) {
    return;
  }
  
  // Create a unique ID for this reminder
  const reminderId = `med-reminder-${id}-${Date.now()}`;
  
  // Store the toast ID in our active reminders map
  activeReminders.set(id, reminderId);
  
  return toast.info(
    <div>
      <h4>{translations.timeToTake}</h4>
      <p><strong>{name}</strong>: {dosage} {unit}</p>
      <p>{translations.pleaseMarkAsTaken}</p>
    </div>,
    {
      ...toastOptions,
      icon: '💊',
      toastId: reminderId,
      autoClose: false, // Never auto close
      closeOnClick: false, // Can't close by clicking
      draggable: false, // Can't drag to dismiss
      closeButton: false, // No close button
    }
  );
};

// Medication taken confirmation
export const showMedicationTaken = (medication) => {
  // If there's an active reminder for this medication, dismiss it
  if (activeReminders.has(medication.id)) {
    toast.dismiss(activeReminders.get(medication.id));
    activeReminders.delete(medication.id);
  }
  
  return toast.success(
    <div>
      <p><strong>{medication.name}</strong> {translations.medicationTaken}</p>
    </div>,
    {
      ...toastOptions,
      autoClose: 3000,
      icon: '✅',
      toastId: `med-taken-${medication.id}-${Date.now()}`,
    }
  );
};

// Medication skipped notification
export const showMedicationSkipped = (medication) => {
  // If there's an active reminder for this medication, dismiss it
  if (activeReminders.has(medication.id)) {
    toast.dismiss(activeReminders.get(medication.id));
    activeReminders.delete(medication.id);
  }
  
  return toast.warning(
    <div>
      <p><strong>{medication.name}</strong> {translations.medicationSkipped}</p>
    </div>,
    {
      ...toastOptions,
      autoClose: 3000,
      icon: '⏭️',
      toastId: `med-skipped-${medication.id}-${Date.now()}`,
    }
  );
};

// Low stock warning
export const showLowStockWarning = (medication, daysRemaining) => {
  return toast.error(
    <div>
      <h4>{translations.lowStockWarning}</h4>
      <p><strong>{medication.name}</strong>: {translations.only} {medication.quantity} {medication.unit} {translations.left}</p>
      <p>{translations.refillNeeded}</p>
    </div>,
    {
      ...toastOptions,
      icon: '⚠️',
      toastId: `low-stock-${medication.id}`,
    }
  );
};

// Check and notify for upcoming medications
export const checkUpcomingMedications = (medications, checkMedicationTaken) => {
  if (!medications || medications.length === 0) return;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayName = dayNames[currentDay];
  
  medications.forEach(medication => {
    if (!medication.schedule) return;
    
    // Handle both schedule formats
    let scheduleTimes = [];
    let shouldCheckToday = true;
    
    // Check schedule format and get times
    if (Array.isArray(medication.schedule)) {
      // Old format: schedule is directly an array of times
      scheduleTimes = medication.schedule;
      // Old format always assumed daily
      shouldCheckToday = true;
    } else {
      // New format: schedule is an object with type, days, and times properties
      if (!medication.schedule.times || !Array.isArray(medication.schedule.times) || medication.schedule.times.length === 0) {
        return; // Skip if no valid times
      }
      
      // Check if this medication should be taken today based on schedule type
      if (medication.schedule.type === 'specific-days') {
        shouldCheckToday = medication.schedule.days && medication.schedule.days.includes(todayName);
      } else if (medication.schedule.type === 'daily') {
        shouldCheckToday = true;
      } else {
        shouldCheckToday = false;
      }
      
      scheduleTimes = medication.schedule.times;
    }
    
    // If not scheduled for today, skip
    if (!shouldCheckToday) return;
    
    // Process each time in the schedule
    scheduleTimes.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      
      // Check if the medication is due now or was due in the last 30 minutes
      const isDueNow = (
        (hours === currentHour && Math.abs(minutes - currentMinute) <= 30) ||
        (hours === currentHour - 1 && minutes >= 30 && (minutes - 30 + 60) >= currentMinute)
      );
      
      if (isDueNow) {
        // Check if it's already been taken
        const status = checkMedicationTaken ? checkMedicationTaken(medication.id, time) : null;
        
        // Only show reminder if not already taken or skipped
        if (!status) {
          showMedicationReminder(medication);
        }
      }
      
      // Also check for upcoming medications in the next 15 minutes
      const isUpcoming = (
        (hours === currentHour && minutes - currentMinute <= 15 && minutes - currentMinute > 0) ||
        (hours === currentHour + 1 && minutes + 60 - currentMinute <= 15)
      );
      
      if (isUpcoming) {
        // Show a regular notification that this medication will be due soon
        toast.info(
          <div>
            <h4>{translations.upcomingMedication}</h4>
            <p><strong>{medication.name}</strong> {translations.willBeDueAt} {time}</p>
          </div>,
          {
            ...toastOptions,
            icon: '⏰',
            toastId: `upcoming-${medication.id}-${time}`,
            autoClose: 10000,
          }
        );
      }
    });
  });
};

// Clear all active reminders
export const clearAllReminders = () => {
  activeReminders.forEach((id) => {
    toast.dismiss(id);
  });
  activeReminders.clear();
};
