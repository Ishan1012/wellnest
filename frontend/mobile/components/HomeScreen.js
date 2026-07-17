import React, { useState, useEffect } from 'react';
import responsiveSize from '../hooks/responsiveSize';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Animated
} from 'react-native';

const HomeScreen = ({ navigation }) => {
    let a = require('../assets/nessi.png');
    let b = require('../assets/logo.png');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');

    const buttonPressed = () => {
        if (!loading && !user)
            navigation.navigate('Login');
        else
            navigation.navigate('DashBoard');
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                <Image source={b} style={styles.iconImg} />
                <Text style={styles.appname}>{' '}WellNest</Text>
            </View>
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}> Welcome To WellNest</Text>
                    
                    <View style={styles.hero}>
                        <Image source={a} style={styles.heroImg} />
                    </View>
                </View>

                <TouchableOpacity style={styles.btn} onPress={() => buttonPressed()}>
                    <Text style={styles.btnText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 24,
        justifyContent: 'flex-start',
    },
    header: {
        width: '100%',
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    iconImg: {
        width: responsiveSize(60),
        height: responsiveSize(60),
    },
    appname: {
        paddingRight: 10,
        fontSize: 40,
        fontWeight: '600',
        color: '#3e6f7a',
    },
    title: {
        fontSize: responsiveSize(28),
        fontWeight: '600',
        color: '#3e6f7a',
        textAlign: 'center',
        marginBottom: 12,
    },
    hero: {
        padding: 16,
        borderRadius: 16,
    },
    heroImg: {
        alignSelf: 'center',
        width: "100%",
        height: responsiveSize(550),
        borderRadius: 10,
    },
    btn: {
        marginTop: 0,
        backgroundColor: '#3e6f7a',
        paddingVertical: 12,
        paddingHorizontal: 14,
        height: responsiveSize(60),
        width: responsiveSize(300),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 60,
        cursor: 'pointer'
    },
    btnText: {
        fontSize: responsiveSize(20),
        fontWeight: '500',
        color: '#fff',
    }
});

export default HomeScreen;