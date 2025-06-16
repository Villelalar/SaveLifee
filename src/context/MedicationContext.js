import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState = {
  medications: JSON.parse(localStorage.getItem('medications')) || [],
  consumptionHistory: JSON.parse(localStorage.getItem('consumptionHistory')) || [],
  loading: false,
  error: null
};

// Create context
const MedicationContext = createContext(initialState);

// Reducer function
const medicationReducer = (state, action) => {
  let updatedMedications;
  let updatedHistory;
  
  switch (action.type) {
    case 'GET_MEDICATIONS':
      return {
        ...state,
        medications: action.payload,
        loading: false
      };
    case 'ADD_MEDICATION':
      return {
        ...state,
        medications: [...state.medications, action.payload]
      };
    case 'DELETE_MEDICATION':
      // Also remove any consumption records for this medication
      return {
        ...state,
        medications: state.medications.filter(med => med.id !== action.payload),
        consumptionHistory: state.consumptionHistory.filter(record => record.medicationId !== action.payload),
        loading: false
      };
    case 'UPDATE_MEDICATION':
      return {
        ...state,
        medications: state.medications.map(med =>
          med.id === action.payload.id ? action.payload : med
        )
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'RECORD_CONSUMPTION':
      const { medicationId, timestamp, taken } = action.payload;
      const newRecord = { id: uuidv4(), medicationId, timestamp, taken };
      
      updatedHistory = [...state.consumptionHistory, newRecord];
      localStorage.setItem('consumptionHistory', JSON.stringify(updatedHistory));
      
      return {
        ...state,
        consumptionHistory: updatedHistory
      };
      
    case 'UPDATE_CONSUMPTION':
      updatedHistory = state.consumptionHistory.map(record => 
        record.id === action.payload.recordId 
          ? { ...record, taken: action.payload.taken }
          : record
      );
      
      localStorage.setItem('consumptionHistory', JSON.stringify(updatedHistory));
      
      return {
        ...state,
        consumptionHistory: updatedHistory
      };
    
    default:
      return state;
  }
};

// Provider component
export const MedicationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(medicationReducer, initialState);

  // Load medications from localStorage when the component mounts
  useEffect(() => {
    const loadMedications = () => {
      try {
        const storedMedications = localStorage.getItem('medications');
        if (storedMedications) {
          dispatch({
            type: 'GET_MEDICATIONS',
            payload: JSON.parse(storedMedications)
          });
        }
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to load medications'
        });
      }
    };

    loadMedications();
  }, []);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(state.medications));
  }, [state.medications]);

  // Actions
  const getMedications = () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const storedMedications = localStorage.getItem('medications');
      dispatch({
        type: 'GET_MEDICATIONS',
        payload: storedMedications ? JSON.parse(storedMedications) : []
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to fetch medications'
      });
    }
  };

  const addMedication = (medication) => {
    const newMedication = {
      ...medication,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };

    dispatch({
      type: 'ADD_MEDICATION',
      payload: newMedication
    });
  };

  const updateMedication = (medication) => {
    dispatch({
      type: 'UPDATE_MEDICATION',
      payload: {
        ...medication,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const deleteMedication = async (id) => {
    dispatch({ type: 'DELETE_MEDICATION', payload: id });
  };
  
  // Record when medication is taken or skipped
  const recordConsumption = (medicationId, timestamp = new Date().toISOString(), taken = true) => {
    dispatch({ 
      type: 'RECORD_CONSUMPTION', 
      payload: { medicationId, timestamp, taken }
    });
  };
  
  // Update an existing consumption record
  const updateConsumption = (recordId, taken) => {
    dispatch({
      type: 'UPDATE_CONSUMPTION',
      payload: { recordId, taken }
    });
  };
  
  // Get consumption history for a specific medication
  const getMedicationConsumptionHistory = (medicationId) => {
    return state.consumptionHistory.filter(record => record.medicationId === medicationId);
  };
  
  // Check if a medication was taken at a specific scheduled time
  const checkMedicationTaken = (medicationId, scheduledTime, date = new Date()) => {
    // Safety check - if no medicationId or scheduledTime, return null
    if (!medicationId || !scheduledTime) {
      return null;
    }
    
    // Format date to YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Find records for this medication on this date
    const dayRecords = state.consumptionHistory.filter(record => {
      const recordDate = record.timestamp.split('T')[0];
      return record.medicationId === medicationId && recordDate === formattedDate;
    });
    
    // Check if any record matches the scheduled time (within 30 minutes)
    for (const record of dayRecords) {
      const recordTime = new Date(record.timestamp);
      const [hours, minutes] = scheduledTime.split(':').map(Number);
      
      const scheduleDateTime = new Date(date);
      scheduleDateTime.setHours(hours, minutes, 0, 0);
      
      // Calculate time difference in minutes
      const diffMinutes = Math.abs(recordTime - scheduleDateTime) / (60 * 1000);
      
      if (diffMinutes <= 30) {
        return { taken: record.taken, recordId: record.id };
      }
    }
    
    return null; // No record found for this time
  };

  return (
    <MedicationContext.Provider
      value={{
        medications: state.medications,
        consumptionHistory: state.consumptionHistory,
        loading: state.loading,
        error: state.error,
        addMedication,
        updateMedication,
        deleteMedication,
        getMedications,
        recordConsumption,
        updateConsumption,
        getMedicationConsumptionHistory,
        checkMedicationTaken
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

// Custom hook to use the medication context
export const useMedication = () => useContext(MedicationContext);
