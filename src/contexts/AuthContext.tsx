import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { requestAndSaveFCMToken } from '../lib/fcm';

// Extended user profile stored in Firestore
export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    role: string;
    area?: string;
    rewardPoints?: number;
    createdAt?: any;
    phone?: string;
    address?: string;
    citizenID?: string;
    assignedZone?: string;
    memberSince?: any;
    preferences?: {
        notifications?: boolean;
        language?: string;
    };
}

interface AuthContextType {
    currentUser: FirebaseUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeProfile: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            // Clean up previous profile listener if any
            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = null;
            }

            if (user) {
                // Set initial loading state for profile
                setLoading(true);

                // Request FCM token once per session (silently — never blocks auth flow)
                requestAndSaveFCMToken(user.uid).catch(console.warn);

                // Start listening to the user profile document
                const docRef = doc(db, 'users', user.uid);
                unsubscribeProfile = onSnapshot(docRef,
                    (docSnap: any) => {
                        let firestoreData: any = null;
                        if (docSnap.exists()) {
                            firestoreData = docSnap.data();
                        }

                        // Resolve role from Firestore data — Firestore is the source of truth
                        // Validate that the role is one of the allowed values
                        let resolvedRole: string = 'Citizen';
                        if (firestoreData && firestoreData.role) {
                            const validRoles = ['citizen', 'worker', 'admin', 'superadmin', 'green-champion'];
                            const normalizedRole = String(firestoreData.role).toLowerCase();
                            if (validRoles.includes(normalizedRole)) {
                                resolvedRole = firestoreData.role;
                            }
                        }

                        setUserProfile({
                            uid: user.uid,
                            email: user.email || '',
                            name: user.displayName || firestoreData?.name || 'User',
                            role: resolvedRole,
                            area: firestoreData?.area,
                            rewardPoints: firestoreData?.rewardPoints,
                            createdAt: firestoreData?.createdAt,
                            phone: firestoreData?.phone,
                            address: firestoreData?.address,
                            citizenID: firestoreData?.citizenID,
                            assignedZone: firestoreData?.assignedZone,
                            memberSince: firestoreData?.memberSince,
                            preferences: firestoreData?.preferences
                        });
                        setLoading(false);
                    },
                    (error: any) => {
                        console.error("Error listening to user profile:", error);
                        // Fallback
                        setUserProfile({
                            uid: user.uid,
                            email: user.email || '',
                            name: user.displayName || 'User',
                            role: 'Citizen',
                        });
                        setLoading(false);
                    }
                );
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
