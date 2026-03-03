import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
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

// ── Pending admin lookup ──────────────────────────────────────────────────────
// Returns the pending_admins doc data if a Superadmin pre-created an invite for this email.
const getPendingAdminData = async (email: string): Promise<Record<string, any> | null> => {
    const emailKey = email.toLowerCase()
        .replace(/\./g, '_')
        .replace(/@/g, '__at__');
    try {
        const snap = await getDoc(doc(db, 'pending_admins', emailKey));
        if (snap.exists()) return snap.data();
    } catch {
        // Firestore read failure (e.g. network) — fall through to default Citizen
    }
    return null;
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
                        // ── No Firestore document → auto-create a default Citizen profile ─
                        if (!docSnap.exists()) {
                            // Use async IIFE to allow await inside the sync callback
                            (async () => {
                                const email = user.email || '';
                                // Check if a Superadmin pre-created an admin invitation for this email
                                const pending = email ? await getPendingAdminData(email) : null;

                                const newProfile: Record<string, any> = pending
                                    ? {
                                        uid: user.uid,
                                        email: email,
                                        name: pending.name || user.displayName || (email.split('@')[0] ?? 'User'),
                                        role: pending.role || 'Admin',
                                        assignedZone: pending.assignedZone || '',
                                        adminLevel: pending.adminLevel || 'Zone Admin',
                                        status: pending.status || 'Active',
                                        createdAt: serverTimestamp(),
                                    }
                                    : {
                                        uid: user.uid,
                                        email: email,
                                        name: user.displayName || (email.split('@')[0] ?? 'User'),
                                        role: 'Citizen',
                                        createdAt: serverTimestamp(),
                                        rewardPoints: 0,
                                        citizenID: `CIT-${user.uid.slice(-6).toUpperCase()}`,
                                    };

                                setDoc(docRef, newProfile)
                                    .then(async () => {
                                        // Clean up the pending_admins record after consuming it
                                        if (pending && email) {
                                            const emailKey = email.toLowerCase()
                                                .replace(/\./g, '_')
                                                .replace(/@/g, '__at__');
                                            deleteDoc(doc(db, 'pending_admins', emailKey)).catch(() => {});
                                        }
                                    })
                                    .catch((err: unknown) => {
                                        console.error('[AuthContext] Auto-create profile failed:', err);
                                        setUserProfile({
                                            uid: user.uid,
                                            email: email,
                                            name: user.displayName || (email.split('@')[0] ?? 'User'),
                                            role: 'Citizen',
                                        });
                                        setLoading(false);
                                    });
                            })();
                            // Keep loading=true — the next onSnapshot event will resolve everything
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
                        setLoading(false);
                    },
                    (error: unknown) => {
                        console.error("[AuthContext] Firestore profile read error:", error);
                        // Treat as a fresh user — set a minimal Citizen profile so the app loads
                        setUserProfile({
                            uid: user.uid,
                            email: user.email || '',
                            name: user.displayName || (user.email?.split('@')[0] ?? 'User'),
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
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
