import React from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useHabits } from '../../context/HabitContext';
import { Habit } from '../../types/habit';

interface StreakInfo {
  habit: Habit | null;
  streak: number;
}

export default function StatsScreen() {
  const { habits, habitLogs, getHabitStreak, loading } = useHabits();
  
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading statistics...</ThemedText>
      </ThemedView>
    );
  }
  
  // Calculate total habits
  const totalHabits = habits.length;
  
  // Calculate total completions
  const totalCompletions = habitLogs.filter(log => log.completed).length;
  
  // Calculate completion rate
  const completionRate = habitLogs.length > 0 
    ? Math.round((totalCompletions / habitLogs.length) * 100) 
    : 0;
  
  // Find habit with longest streak
  const habitWithLongestStreak = habits.reduce<StreakInfo>((longest, habit) => {
    const streak = getHabitStreak(habit.id);
    return streak > longest.streak ? { habit, streak } : longest;
  }, { habit: null, streak: 0 });
  
  // Calculate completions today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completionsToday = habitLogs.filter(log => 
    new Date(log.date).setHours(0, 0, 0, 0) === today.getTime() && log.completed
  ).length;
  
  // Calculate completion rate for today
  const todayCompletionRate = habits.length > 0 
    ? Math.round((completionsToday / habits.length) * 100) 
    : 0;
  
  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.title}>Statistics</ThemedText>
      
      <View style={styles.statsGrid}>
        <ThemedView style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="calendar" size={24} color="#007AFF" />
          </View>
          <ThemedText style={styles.statValue}>{totalHabits}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Habits</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
          </View>
          <ThemedText style={styles.statValue}>{totalCompletions}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Completions</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trending-up" size={24} color="#FF9500" />
          </View>
          <ThemedText style={styles.statValue}>{completionRate}%</ThemedText>
          <ThemedText style={styles.statLabel}>Completion Rate</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="flame" size={24} color="#FF3B30" />
          </View>
          <ThemedText style={styles.statValue}>{habitWithLongestStreak.streak}</ThemedText>
          <ThemedText style={styles.statLabel}>Longest Streak</ThemedText>
        </ThemedView>
      </View>
      
      <ThemedText style={styles.sectionTitle}>Today's Progress</ThemedText>
      
      <ThemedView style={styles.todayCard}>
        <View style={styles.todayHeader}>
          <ThemedText style={styles.todayTitle}>Completion Rate</ThemedText>
          <ThemedText style={styles.todayValue}>{todayCompletionRate}%</ThemedText>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${todayCompletionRate}%` }
            ]} 
          />
        </View>
        
        <ThemedText style={styles.todaySubtitle}>
          {completionsToday} of {totalHabits} habits completed today
        </ThemedText>
      </ThemedView>
      
      {habits.length === 0 && (
        <ThemedView style={styles.emptyState}>
          <Ionicons name="stats-chart" size={64} color="#ccc" />
          <ThemedText style={styles.emptyText}>
            No habits to analyze yet
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Add some habits to see your statistics
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  todayCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  todaySubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
});
