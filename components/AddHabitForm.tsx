import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useHabits } from '../context/HabitContext';

interface AddHabitFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ isVisible, onClose }) => {
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const handleSubmit = async () => {
    if (name.trim() === '') return;
    
    await addHabit({
      name: name.trim(),
      description: description.trim() || undefined,
      frequency,
    });
    
    // Reset form
    setName('');
    setDescription('');
    setFrequency('daily');
    
    // Close modal
    onClose();
  };
  
  const handleCancel = () => {
    // Reset form
    setName('');
    setDescription('');
    setFrequency('daily');
    
    // Close modal
    onClose();
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Add New Habit</ThemedText>
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter habit name"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Description (optional)</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter habit description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Frequency</ThemedText>
            <View style={styles.frequencyContainer}>
              <Pressable
                style={[
                  styles.frequencyOption,
                  frequency === 'daily' && styles.frequencyOptionSelected
                ]}
                onPress={() => setFrequency('daily')}
              >
                <ThemedText
                  style={[
                    styles.frequencyText,
                    frequency === 'daily' && styles.frequencyTextSelected
                  ]}
                >
                  Daily
                </ThemedText>
              </Pressable>
              
              <Pressable
                style={[
                  styles.frequencyOption,
                  frequency === 'weekly' && styles.frequencyOptionSelected
                ]}
                onPress={() => setFrequency('weekly')}
              >
                <ThemedText
                  style={[
                    styles.frequencyText,
                    frequency === 'weekly' && styles.frequencyTextSelected
                  ]}
                >
                  Weekly
                </ThemedText>
              </Pressable>
              
              <Pressable
                style={[
                  styles.frequencyOption,
                  frequency === 'monthly' && styles.frequencyOptionSelected
                ]}
                onPress={() => setFrequency('monthly')}
              >
                <ThemedText
                  style={[
                    styles.frequencyText,
                    frequency === 'monthly' && styles.frequencyTextSelected
                  ]}
                >
                  Monthly
                </ThemedText>
              </Pressable>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.button, name.trim() === '' && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={name.trim() === ''}
          >
            <ThemedText style={styles.buttonText}>Add Habit</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  frequencyOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  frequencyText: {
    fontSize: 14,
  },
  frequencyTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AddHabitForm; 