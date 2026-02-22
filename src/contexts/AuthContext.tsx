import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Extended user profile stored in Firestore
export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    role: 'Citizen' | 'Worker' | 'Admin' | 'Superadmin';
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    // Fetch ID Token to get Custom Claims securely
                    const idTokenResult = await user.getIdTokenResult();
                    const claimRole = idTokenResult.claims.role as string | undefined;

                    // Fetch extended user profile from Firestore
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    let firestoreData: any = null;

                    if (docSnap.exists()) {
                        firestoreData = docSnap.data();
                    }

                    // Secure Role Resolution:
                    // For now, trusting Firestore entirely so anyone can sign up as any role directly from the UI.
                    let resolvedRole: UserProfile['role'] = 'Citizen';

                    if (claimRole === 'SUPER_ADMIN') resolvedRole = 'Superadmin';
                    else if (claimRole === 'ADMIN') resolvedRole = 'Admin';
                    else if (claimRole === 'WORKER') resolvedRole = 'Worker';
                    else if (claimRole === 'CITIZEN') resolvedRole = 'Citizen';
                    else if (firestoreData && firestoreData.role) {
                        resolvedRole = firestoreData.role;
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
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Critical Fallback: if Firestore fails (e.g., rules not synced, doc missing), still let them in as Citizen
                    setUserProfile({
                        uid: user.uid,
                        email: user.email || '',
                        name: user.displayName || 'User',
                        role: 'Citizen',
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
