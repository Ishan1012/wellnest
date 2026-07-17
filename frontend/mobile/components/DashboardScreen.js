import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import responsiveSize from '../hooks/responsiveSize';
import useGetUser from '../hooks/useGetUser';
import useGetAppointments from '../hooks/useGetAppointments';

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const drawerAnimation = useRef(new Animated.Value(-250)).current;
  const user = useGetUser();
  const appointments = useGetAppointments();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 2000);

    return () => {
      clearTimeout(timer); // Cleanup timer on unmount
    };
  }, []);

  const toggleDrawer = () => {
    if (drawerAnimation._value === -250) {
      // Open drawer
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Close drawer
      Animated.timing(drawerAnimation, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const logout = () => {
    navigation.goBack();
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6399a0" />
        <Text style={styles.loaderText}>Please wait while we prepare your dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnimation }] }]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleDrawer}>
          <Ionicons name="close" size={responsiveSize(50)} color="#2E7D32" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleDrawer(); navigation.navigate('Profile', { user: user }); }}>
          <Text style={styles.drawerText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleDrawer(); navigation.navigate('Help'); }}>
          <Text style={styles.drawerText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleDrawer(); navigation.navigate('About'); }}>
          <Text style={styles.drawerText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleDrawer(); logout(); }}>
          <Text style={[styles.drawerText, { color: '#FF0000' }]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.hamburgerButton} onPress={toggleDrawer}>
          <Ionicons name="menu" size={responsiveSize(40)} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Upcoming Appointments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {appointments.map((appointment) => (
            <View style={styles.appointmentContainer} key={appointment.id}>
              <View style={styles.appointmentCard}>
                <View style={styles.doctorInfo}>
                  <Ionicons name="person" size={24} color="#6399a0" />
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.doctorName}>{appointment.doctor}</Text>
                    <Text style={styles.appointmentTime}>{appointment.date}, {appointment.time}</Text>
                    <Text style={styles.appointmentType}>{appointment.type}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.rescheduleButton} onPress={() => navigation.navigate('Details', { appointment: appointment })}>
                  <Text style={styles.rescheduleText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Appointment', { user: user })}>
            <Ionicons name="calendar" size={24} color="#6399a0" />
            <Text style={styles.actionText}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Records')}>
            <Ionicons name="document" size={24} color="#6399a0" />
            <Text style={styles.actionText}>View Records</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Consult')}>
            <Ionicons name="chatbubbles" size={24} color="#6399a0" />
            <Text style={styles.actionText}>Consult Doctor</Text>
          </TouchableOpacity>
        </View>

        {/* Health Tips Section */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <TouchableOpacity style={styles.tipCard} onPress={() => navigation.navigate('Tips', { tipId: 1 })}>
            <Text style={styles.tipTitle}>Stay Hydrated</Text>
            <Text style={styles.tipDescription}>Drink 8 glasses of water daily.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tipCard} onPress={() => navigation.navigate('Tips', { tipId: 2 })}>
            <Text style={styles.tipTitle}>Daily Exercise</Text>
            <Text style={styles.tipDescription}>Aim for at least 30 minutes of activity.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loaderText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#6399a0',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#E8F5E9',
    padding: 20,
    zIndex: 1000,
  },
  closeButton: {
    paddingTop: responsiveSize(20),
    paddingBottom: 10,
    fontSize: responsiveSize(30),
    alignItems: 'flex-start',
  },
  drawerItem: {
    paddingVertical: 15,
  },
  drawerText: {
    fontSize: responsiveSize(30),
    color: '#2E7D32',
  },
  header: {
    paddingTop: responsiveSize(50),
    padding: 20,
    backgroundColor: '#E8F5E9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: responsiveSize(28),
    marginLeft: responsiveSize(55),
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: responsiveSize(28),
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  appointmentContainer: {
    marginBottom: 10,
  },
  appointmentCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentDetails: {
    marginLeft: 10,
  },
  appointmentType: {
    fontSize: 14,
    color: '#666666',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666666',
  },
  rescheduleButton: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#2E7D32',
    padding: 10,
    borderRadius: 20,
  },
  rescheduleText: {
    color: '#2E7D32',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionCard: {
    alignItems: 'center',
    width: '30%',
  },
  actionText: {
    fontSize: 12,
    color: '#6399a0',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6399a0',
  },
  tipDescription: {
    fontSize: 12,
    color: '#666666',
  },
});