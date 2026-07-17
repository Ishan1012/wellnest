import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './Header';
import responsiveSize from '../hooks/responsiveSize';
export default function DetailsScreen({ navigation, appointment }) {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container2}>
        <Text style={styles.title}>Appointment Details</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Appointment ID:</Text>
          <Text style={styles.detailValue}>{appointment.id}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{appointment.date}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>{appointment.time}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Doctor:</Text>
          <Text style={styles.detailValue}>{appointment.doctor}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{appointment.type}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>{appointment.status}</Text>
        </View>
        <View style={[styles.detailsContainer, { flexDirection: 'column' }]}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={[styles.detailValue, { marginTop: 5 }]}>{appointment.description}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={[styles.actionButtonText, { color: '#f00' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact Information</Text>
          <Text style={styles.contactInfo}>For any inquiries, please contact:</Text>
          <Text style={styles.contactInfo}>Phone: (123) 456-7890</Text>
          <Text style={styles.contactInfo}>Email: support@wellnest.com</Text>
        </View>
        </View>
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
  container2: {
    padding: 20,
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
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#666666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  contactSection: {
    marginTop: 30,
    marginBottom: 100,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 16,
    color: '#666666',
  },
});