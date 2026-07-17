import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import responsiveSize from '../hooks/responsiveSize';

const LoginScreen = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        if (loading) return; // Prevent multiple clicks

        setLoading(true);
        const { username, password } = form;

        if (!username || !password) {
            Alert.alert('Missing Information', 'All fields are required. Please complete the form.');
            setLoading(false);
            return;
        }

        try {
            console.log(username, password);
        } catch (error) {
            console.log(error);
            Alert.alert('Login failed', error?.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
            navigation.goBack();
            navigation.navigate('DashBoard');
        }
    };

    const signup = () => {
        navigation.goBack();
        navigation.navigate('Signup');
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.inner2}>
                    <Image
                        source={require('../assets/nessi first aid cross.png')} // Replace with your local Mewmo image
                        style={styles.mascot}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>Welcome Back!</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#aaa"
                        keyboardType="email-address"
                        onChangeText={(text) => handleChange('username', text)}
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

                    <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                        {loading ? (
                            <ActivityIndicator size='large' color='#fff' style={styles.loginText} />
                        ) : (
                            <Text style={styles.loginText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={styles.forgot}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.signup}>Don’t have an account?</Text>
                        <TouchableOpacity onPress={signup}>
                            <Text style={[styles.signupLink, styles.signup, { color: '#3e6f7a' }]}>{' '}Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const themeBlue = '#3e6f7a';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inner2: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    mascot: {
        width: responsiveSize(200),
        height: responsiveSize(290),
        marginBottom: 10,
    },
    title: {
        fontSize: responsiveSize(35),
        fontWeight: '600',
        color: themeBlue,
        marginBottom: 20,
        fontFamily: 'System',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: themeBlue,
        color: "#000",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: responsiveSize(20),
    },
    loginButton: {
        backgroundColor: themeBlue,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 15,
        marginBottom: 15,
        width: '50%',
        alignItems: 'center',
    },
    loginText: {
        color: '#fff',
        fontSize: responsiveSize(25),
        fontWeight: '500',
    },
    forgot: {
        color: themeBlue,
        fontSize: responsiveSize(20),
        marginBottom: 20,
    },
    signup: {
        color: '#555',
        fontSize: responsiveSize(20),
    },
    signupLink: {
        color: themeBlue,
        fontWeight: '600',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: themeBlue,
        borderWidth: 1,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 16
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        color: '#000',
        fontSize: responsiveSize(20),
    },
});

export default LoginScreen;
