import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import responsiveSize from '../hooks/responsiveSize';

export default function SignupScreen({ navigation }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        if (loading) return; // Prevent multiple clicks

        setLoading(true);
        const { username, email, password, confirmPassword } = form;

        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Missing Information', 'All fields are required. Please complete the form.');
            setLoading(false);
            return;
        }

        try {
            Alert.alert('Signup Successful', 'Your account has been created successfully.', [
                {
                    text: 'OK', onPress: () => {
                        navigation.goBack();
                        navigation.navigate('DashBoard');
                    }
                }
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert('Signup failed', error?.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={[styles.container]}>
                <Image
                    source={require('../assets/nessi first aid cross.png')} // Replace with your local Mewmo image
                    style={styles.mascot}
                    resizeMode="contain"
                />
                <Text style={styles.heading}>Create an Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#aaa"
                    onChangeText={(text) => handleChange('username', text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    onChangeText={(text) => handleChange('email', text)}
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => handleChange('password', text)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
                    </TouchableOpacity>
                </View>

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!showConfirmPassword}
                        onChangeText={(text) => handleChange('confirmPassword', text)}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    {loading ? (
                        <ActivityIndicator size='large' color='#fff' style={styles.buttonText} />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 24,
    },
    heading: {
        fontSize: responsiveSize(35),
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#3e6f7a',
        textAlign: 'center',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        color: '#000',
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        color: '#000',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3e6f7a',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    mascot: {
        width: responsiveSize(200),
        height: responsiveSize(290),
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: responsiveSize(22),
        fontWeight: '600',
    }
});
