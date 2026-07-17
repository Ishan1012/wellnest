import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Header from './Header';
import responsiveSize from '../hooks/responsiveSize';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AppointmentScreen() {
  const [appointmentType, setAppointmentType] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson' },
    { id: 2, name: 'Dr. John Doe' },
    { id: 3, name: 'Dr. Jane Smith' },
  ];

  const handleConfirm = () => {
    // Logic to handle appointment confirmation
    console.log('Appointment Confirmed:', {
      appointmentType,
      selectedDoctor,
      patientName,
      patientEmail,
      patientPhone,
      notes,
      date,
      time,
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (selectedTime) => {
    setTime(selectedTime);
    hideTimePicker();
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Book an Appointment</Text>

        {/* Type of Appointment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type of Appointment</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setAppointmentType('General Checkup')}
          >
            <Text style={styles.optionText}>General Checkup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setAppointmentType('Consultation')}
          >
            <Text style={styles.optionText}>Consultation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setAppointmentType('Follow-up')}
          >
            <Text style={styles.optionText}>Follow-up</Text>
          </TouchableOpacity>
        </View>

        {/* Choose Doctor Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Doctor</Text>
          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.optionButton}
              onPress={() => setSelectedDoctor(doctor.name)}
            >
              <Text style={styles.optionText}>{doctor.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date and Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date and Time</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={showDatePicker}
          >
            <Text style={styles.inputText}>
              {date.toLocaleDateString() || 'Select Date'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={date}
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
          <TouchableOpacity
            style={styles.input}
            onPress={showTimePicker}
          >
            <Text style={styles.inputText}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Select Time'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            date={time}
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />
        </View>

        {/* Patient Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details of the Patient</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={patientName}
            onChangeText={setPatientName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={patientEmail}
            onChangeText={setPatientEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={patientPhone}
            onChangeText={setPatientPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: responsiveSize(50),
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#2E7D32',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  inputText: {
    fontSize: 16,
    color: '#666666',
  },
  confirmButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});