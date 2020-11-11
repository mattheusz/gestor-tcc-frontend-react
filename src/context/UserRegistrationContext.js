import React, { createContext, useState } from 'react';

export const UserRegistrationContext = createContext()

export function UserRegistrationProvider({ children }) {
    const [userRegistration, setUserRegistration] = useState({});

    return (
        <UserRegistrationContext.Provider
            value={{ userRegistration, setUserRegistration }}
        >
            {children}
        </UserRegistrationContext.Provider>
    )
}
