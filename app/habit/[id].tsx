import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useHabits } from '../../context/HabitContext';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, habitLogs, deleteHabit, getHabitStreak, loading } = useHabits();
  
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading habit details...</ThemedText>
      </ThemedView>
    );
  }
  
  const habit = habits.find(h => h.id === id);
  
  if (!habit) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Habit not found</ThemedText>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  const logs = habitLogs
    .filter(log => log.habitId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const streak = getHabitStreak(id);
  
  const handleDelete = () => {
    deleteHabit(id);
    router.back();
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: habit.name,
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.card}>
          <ThemedText style={styles.title}>{habit.name}</ThemedText>
          {habit.description && (
            <ThemedText style={styles.description}>{habit.description}</ThemedText>
          )}
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Frequency:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Created:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatDate(habit.createdAt)}
            </ThemedText>
          </View>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={24} color="#FF9500" />
            <ThemedText style={styles.streakText}>{streak} day streak</ThemedText>
          </View>
        </ThemedView>
        
        <ThemedText style={styles.sectionTitle}>History</ThemedText>
        
        {logs.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No history yet. Start tracking this habit!
            </ThemedText>
          </ThemedView>
        ) : (
          logs.map(log => (
            <ThemedView key={log.id} style={styles.logItem}>
              <ThemedText style={styles.logDate}>{formatDate(log.date)}</ThemedText>
              <View style={[
                styles.logStatus,
                log.completed ? styles.logStatusCompleted : styles.logStatusMissed
              ]}>
                <ThemedText style={styles.logStatusText}>
                  {log.completed ? 'Completed' : 'Missed'}
                </ThemedText>
              </View>
            </ThemedView>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.7,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#FF9500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  logDate: {
    fontSize: 16,
  },
  logStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  logStatusCompleted: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  logStatusMissed: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  logStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
}); 