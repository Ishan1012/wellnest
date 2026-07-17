import { useState, useEffect } from 'react'

export default function useGetAppointments() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        setAppointments([
            {
                id: 1,
                fname: 'John Doe',
                age: 30,
                gender: 'Male',
                address: '123 Main St, Anytown, USA',
                phone: '555-555-5555',
                email: 'john.doe@example.com',
                date: '2023-01-01',
                time: '10:00',
                doctor: 'Dr. John Doe',
                type: 'General Checkup',
                status: 'pending',
                reason: 'This is a description of the appointment'
            },
            {
                id: 2,
                fname: 'John Doe 2',
                age: 30,
                gender: 'Male',
                address: '123 Main St, Anytown, USA',
                phone: '555-555-5555',
                email: 'john.doe@example.com',
                date: '2023-01-01',
                time: '10:00',
                doctor: 'Dr. John Doe',
                type: 'General Checkup',
                status: 'pending',
                reason: 'This is a description of the appointment'
            },
            {
                id: 3,
                fname: 'John Doe',
                age: 30,
                gender: 'Male',
                address: '123 Main St, Anytown, USA',
                phone: '555-555-5555',
                email: 'john.doe@example.com',
                date: '2023-01-01',
                time: '10:00',
                doctor: 'Dr. John Doe',
                type: 'General Checkup',
                status: 'pending',
                reason: 'This is a description of the appointment'
            }  
        ]);
    }, []);

    return appointments;
}