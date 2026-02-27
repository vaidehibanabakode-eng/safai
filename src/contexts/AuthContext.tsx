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
    profileIncomplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Maps every known role format → canonical Firestore-cased value used by App.tsx routing
const ROLE_NORMALIZATION: Record<string, string> = {
    'superadmin':    'Superadmin',
    'super_admin':   'Superadmin',   // legacy setSuperAdmin.cjs format
    'admin':         'Admin',
    'worker':        'Worker',
    'citizen':       'Citizen',
    'green-champion':'Green-Champion',
    'green_champion':'Green-Champion',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileIncomplete, setProfileIncomplete] = useState(false);

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
                        // ── No Firestore document → profile setup needed ─────────────
                        if (!docSnap.exists()) {
                            setUserProfile({
                                uid: user.uid,
                                email: user.email || '',
                                name: user.displayName || '',
                                role: '',
                            });
                            setProfileIncomplete(true);
                            setLoading(false);
                            return;
                        }

                        const firestoreData = docSnap.data();

                        // ── Normalize role — handle all known formats ─────────────────
                        // e.g. 'Admin', 'SUPER_ADMIN', 'green-champion', 'worker' all work
                        const rawRole = String(firestoreData?.role || '').toLowerCase();
                        const resolvedRole = ROLE_NORMALIZATION[rawRole] || 'Citizen';

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
                        setProfileIncomplete(false);
                        setLoading(false);
                    },
                    (error: any) => {
                        console.error("[AuthContext] Firestore profile read error:", error);
                        // Permission error or network issue — send to profile setup,
                        // NOT silently to CitizenDashboard
                        setUserProfile({
                            uid: user.uid,
                            email: user.email || '',
                            name: user.displayName || 'User',
                            role: '',
                        });
                        setProfileIncomplete(true);
                        setLoading(false);
                    }
                );
            } else {
                setUserProfile(null);
                setProfileIncomplete(false);
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
        loading,
        profileIncomplete,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
