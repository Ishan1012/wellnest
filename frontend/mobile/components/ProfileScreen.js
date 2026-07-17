import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import responsiveSize from '../hooks/responsiveSize';
import Header from './Header';

export default function ProfileScreen({ route }) {
  const { user } = route.params;
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container2}>
          <View style={styles.profileHeader}>
            <Image source={require('../assets/user-icon.png')} style={styles.profileImage} />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.healthInfoSection}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Allergies:</Text>
            <Text style={styles.healthValue}>None</Text>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Medications:</Text>
            <Text style={styles.healthValue}>Aspirin</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  healthInfoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  healthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  healthLabel: {
    fontSize: 16,
    color: '#333333',
  },
  healthValue: {
    fontSize: 16,
    color: '#666666',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
