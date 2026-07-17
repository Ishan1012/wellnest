import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import responsiveSize from '../hooks/responsiveSize'
import Header from './Header'
export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.container2}>
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.appName}>WellNest</Text>
        </View>

        <Text style={styles.missionStatement}>
          "Your health, our priority. WellNest connects you with the best healthcare services at your fingertips."
        </Text>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.featureItem}>• Easy appointment booking</Text>
          <Text style={styles.featureItem}>• Health tips and resources</Text>
          <Text style={styles.featureItem}>• User-friendly interface</Text>
        </View>

        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Meet Our Team</Text>
          <Text style={styles.teamMember}>• Dr. Sarah Johnson - Chief Medical Officer</Text>
          <Text style={styles.teamMember}>• John Doe - Lead Developer</Text>
          <Text style={styles.teamMember}>• Jane Smith - UX/UI Designer</Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.contactInfo}>Email: memomate702@gmail.com</Text>
          <Text style={styles.contactInfo}>Phone: 09123456789</Text>
        </View>

        <View style={styles.socialMediaSection}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity>
              <Ionicons name="logo-facebook" size={24} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="logo-instagram" size={24} color="#C13584" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.policySection}>
          <TouchableOpacity>
            <Text style={styles.policyLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.policyLink}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: responsiveSize(50),

  },
  container2: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  missionStatement: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
  },
  featuresSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 16,
    color: '#666666',
  },
  teamSection: {
    marginBottom: 20,
  },
  teamMember: {
    fontSize: 16,
    color: '#666666',
  },
  contactSection: {
    marginBottom: 20,
  },
  contactInfo: {
    fontSize: 16,
    color: '#666666',
  },
  socialMediaSection: {
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  policySection: {
    marginTop: 20,
    marginBottom: 150,
    alignItems: 'center',
  },
  policyLink: {
    fontSize: 16,
    color: '#2E7D32',
    textDecorationLine: 'underline',
  },
})