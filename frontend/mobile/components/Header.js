import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import responsiveSize from '../hooks/responsiveSize';
const Header = () => {
    const navigation = useNavigation(); // Get the navigation object

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={responsiveSize(27)} color="#000000" />
                <Text style={styles.title}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 50,
        paddingLeft: responsiveSize(20),
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Header background color
    },
    backButton: {
        alignSelf: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 10,
    },
    title: {
        fontSize: responsiveSize(27),
        paddingLeft: 5,
        fontWeight: 'bold',
        color: '#000000', // Title text color
    },
});

export default Header;