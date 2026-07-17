import { useState, useEffect } from 'react'

export default function useGetUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Simulate fetching user data
        const fetchUser = async () => {
            // Replace this with your actual user fetching logic
            const fetchedUser = { id: 1, name: 'John Doe', email: 'john.doe@example.com' }; // Example user data
            setUser(fetchedUser);
        };

        fetchUser();
    }, []);

    return user;
}