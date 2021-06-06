import React, { createContext, ReactNode, useContext } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

interface StorageProviderProps {
   children: ReactNode;
}

interface Storage {
    id: string;
    title: string;
    email: string;
    password: string;
}

interface IStorageContext {
    saveData(formData: FormData): Promise<void>;
    loadData(): Promise<Storage[]>;
}

const StorageContext = createContext({} as IStorageContext)

function StorageProvider({ children }: StorageProviderProps) {
    const dataKey = '@passmanager:logins'

    async function saveData(formData: FormData) {
        try {
            const newLoginData = {
                id: String(uuid.v4()),
                ...formData
            }

            const data = await AsyncStorage.getItem(dataKey)

            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newLoginData
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

        } catch (error) {
            throw new Error(error)
        }
    }

    async function loadData() {
        try {
            const storagedData = await AsyncStorage.getItem(dataKey)

            if (storagedData) {
                const storage = JSON.parse(storagedData)
                
                return storage
            }
        } catch (error) {
            throw new Error(error)
        }

    }

    return (
        <StorageContext.Provider value={{
            saveData,
            loadData
        }}>
            {children}
        </StorageContext.Provider>
    )
}

function useStorageData() {
    const context = useContext(StorageContext);

    return context
}

export { StorageProvider, useStorageData }

