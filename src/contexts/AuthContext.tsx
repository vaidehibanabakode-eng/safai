import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { requestAndSaveFCMToken } from '../lib/fcm';
import { normalizeRoleForStorage } from '../lib/roles';

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
    noDocument: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Role normalization is handled by normalizeRoleForStorage() from src/lib/roles.ts.

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
    const [noDocument, setNoDocument] = useState(false);

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
                setNoDocument(false);

                // Start listening to the user profile document
                const docRef = doc(db, 'users', user.uid);
                unsubscribeProfile = onSnapshot(docRef,
                    (docSnap: any) => {
                        let firestoreData: any = null;
                        if (docSnap.exists()) {
                            firestoreData = docSnap.data();
                            setNoDocument(false);
                            console.log('✅ User document found in Firestore:', { uid: user.uid, data: firestoreData });
                        } else {
                            console.error('❌ NO USER DOCUMENT in Firestore for:', user.uid, user.email);
                            console.error('   This user needs to sign up again or have their document created.');
                            setNoDocument(true);
                        }

                        const firestoreData = docSnap.data();

                        // ── Normalize role — handle all known formats ─────────────────
                        // e.g. 'Admin', 'SUPER_ADMIN', 'green-champion', 'worker' all work
                        const rawRole = String(firestoreData?.role || '').toLowerCase();
                        const resolvedRole = normalizeRoleForStorage(rawRole);

                        // Dev-mode visibility: log role resolution so routing bugs are obvious
                        if (import.meta.env.DEV) {
                            console.log(
                                `[AuthContext] uid=${user.uid} | firestoreRole="${firestoreData?.role}" ` +
                                `→ rawRole="${rawRole}" → resolvedRole="${resolvedRole}"`
                            );
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
                        // Fallback - use lowercase for consistency
                        setUserProfile({
                            uid: user.uid,
                            email: user.email || '',
                            name: user.displayName || 'User',
                            role: 'citizen',
                        });
                        setLoading(false);
                    }
                );
            } else {
                setUserProfile(null);
                setNoDocument(false);
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
        noDocument,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
