import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useHabits } from '../context/HabitContext';
import { Habit } from '../types/habit';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface HabitItemProps {
  habit: Habit;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit }) => {
  const { logHabit, getHabitLogs, getHabitStreak } = useHabits();
  
  // Check if habit is completed today
  const isCompletedToday = () => {
    const logs = getHabitLogs(habit.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return logs.some(log => 
      new Date(log.date).setHours(0, 0, 0, 0) === today.getTime() && log.completed
    );
  };
  
  const streak = getHabitStreak(habit.id);
  const completed = isCompletedToday();
  
  const handleToggleCompletion = () => {
    logHabit(habit.id, !completed);
  };
  
  return (
    <ThemedView style={styles.container}>
      <Link 
        href={{
          pathname: "/habit/[id]",
          params: { id: habit.id }
        }}
        asChild
      >
        <TouchableOpacity style={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <ThemedText style={styles.title}>{habit.name}</ThemedText>
            {habit.description && (
              <ThemedText style={styles.description}>{habit.description}</ThemedText>
            )}
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={16} color="#FF9500" />
              <ThemedText style={styles.streakText}>{streak} day streak</ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
      
      <TouchableOpacity 
        style={[
          styles.checkButton,
          completed ? styles.checkButtonCompleted : {}
        ]}
        onPress={handleToggleCompletion}
      >
        {completed ? (
          <Ionicons name="checkmark" size={24} color="#FFFFFF" />
        ) : null}
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  contentContainer: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#FF9500',
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
});

export default HabitItem; 