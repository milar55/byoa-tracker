import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Habit, HabitLog } from '../types/habit';

interface HabitContextType {
  habits: Habit[];
  habitLogs: HabitLog[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  logHabit: (habitId: string, completed: boolean) => Promise<void>;
  getHabitLogs: (habitId: string) => HabitLog[];
  getHabitStreak: (habitId: string) => number;
  loading: boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Firestore on mount
  useEffect(() => {
    const habitsCollectionRef = collection(db, 'habits');
    const logsCollectionRef = collection(db, 'habitLogs');
    
    // Set up real-time listeners
    const unsubscribeHabits = onSnapshot(habitsCollectionRef, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Habit;
      });
      setHabits(habitsData);
    });
    
    const unsubscribeLogs = onSnapshot(logsCollectionRef, (snapshot) => {
      const logsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date: data.date?.toDate() || new Date(),
        } as HabitLog;
      });
      setHabitLogs(logsData);
      setLoading(false);
    });
    
    // Clean up listeners on unmount
    return () => {
      unsubscribeHabits();
      unsubscribeLogs();
    };
  }, []);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    try {
      const newHabitRef = doc(collection(db, 'habits'));
      const newHabit: Habit = {
        ...habitData,
        id: newHabitRef.id,
        createdAt: new Date(),
      };
      
      await setDoc(newHabitRef, {
        ...newHabit,
        createdAt: Timestamp.fromDate(newHabit.createdAt),
      });
      
      // No need to update state manually as the onSnapshot listener will handle it
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      // Delete the habit
      await deleteDoc(doc(db, 'habits', id));
      
      // Delete all logs for this habit
      const logsQuery = query(collection(db, 'habitLogs'), where('habitId', '==', id));
      const logsSnapshot = await getDocs(logsQuery);
      
      const deletePromises = logsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      
      // No need to update state manually as the onSnapshot listener will handle it
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const logHabit = async (habitId: string, completed: boolean) => {
    try {
      // Check if there's already a log for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayLogs = habitLogs.filter(log => 
        log.habitId === habitId && 
        new Date(log.date).setHours(0, 0, 0, 0) === today.getTime()
      );
      
      if (todayLogs.length > 0) {
        // Update existing log
        const existingLog = todayLogs[0];
        await setDoc(doc(db, 'habitLogs', existingLog.id), {
          ...existingLog,
          completed,
          date: Timestamp.fromDate(existingLog.date),
        });
      } else {
        // Create new log
        const newLogRef = doc(collection(db, 'habitLogs'));
        const newLog: HabitLog = {
          id: newLogRef.id,
          habitId,
          date: today,
          completed
        };
        
        await setDoc(newLogRef, {
          ...newLog,
          date: Timestamp.fromDate(newLog.date),
        });
      }
      
      // No need to update state manually as the onSnapshot listener will handle it
    } catch (error) {
      console.error('Error logging habit:', error);
    }
  };

  const getHabitLogs = (habitId: string) => {
    return habitLogs.filter(log => log.habitId === habitId);
  };

  const getHabitStreak = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    const logs = getHabitLogs(habitId)
      .filter(log => log.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (logs.length === 0) return 0;
    
    let streak = 1;
    let currentDate = new Date(logs[0].date);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < logs.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      const logDate = new Date(logs[i].date);
      logDate.setHours(0, 0, 0, 0);
      
      if (logDate.getTime() === prevDate.getTime()) {
        streak++;
        currentDate = logDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const value = {
    habits,
    habitLogs,
    addHabit,
    deleteHabit,
    logHabit,
    getHabitLogs,
    getHabitStreak,
    loading
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}; 