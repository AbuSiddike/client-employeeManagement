import { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

import axios from "../api/axiosConfig.js";
import { auth } from "../firebase/firebase.init.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    axios.defaults.withCredentials = true;

    // Sync Firebase user -> Backend JWT
    const syncFirebaseWithBackend = async (user) => {
        if (!user) {
            setRole(null);
            return;
        }

        const idToken = await user.getIdToken();

        // Tell backend to generate JWT cookie
        await axios.post(
            "/auth/firebase",
            { idToken },
            { withCredentials: true }
        );

        // Fetch backend user (role, uid, email)
        const res = await axios.get("/auth/me", { withCredentials: true });

        setRole(res.data.role);
    };

    // Watch Firebase authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);

            if (user && !syncing) {
                setSyncing(true);
                await syncFirebaseWithBackend(user);
                setSyncing(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Register
    const registerWithEmail = async (email, password) => {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = result.user;

        const idToken = await user.getIdToken();
        await axios.post(
            "/auth/firebase",
            { idToken },
            { withCredentials: true }
        );

        const me = await axios.get("/auth/me", { withCredentials: true });
        setRole(me.data.role);

        return user;
    };

    // Login (email/password)
    const loginWithEmail = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        const idToken = await user.getIdToken();
        await axios.post(
            "/auth/firebase",
            { idToken },
            { withCredentials: true }
        );

        const me = await axios.get("/auth/me", { withCredentials: true });
        setRole(me.data.role);

        return user;
    };

    // Google Login
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const idToken = await user.getIdToken();
        await axios.post(
            "/auth/firebase",
            { idToken },
            { withCredentials: true }
        );

        const me = await axios.get("/auth/me", { withCredentials: true });
        setRole(me.data.role);

        return user;
    };

    // Logout
    const logout = async () => {
        await signOut(auth);
        await axios.post("/auth/logout", {}, { withCredentials: true });
        setFirebaseUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                role,
                loading,
                registerWithEmail,
                loginWithEmail,
                loginWithGoogle,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
