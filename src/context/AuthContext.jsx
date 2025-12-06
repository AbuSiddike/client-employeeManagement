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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            setLoading(false);

            if (user) {
                const idToken = await user.getIdToken();

                try {
                    await axios.post("/auth/firebase", { idToken });
                } catch (err) {
                    console.error("Backend JWT request failed:", err);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const registerWithEmail = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        setFirebaseUser(userCredential.user);

        const idToken = await userCredential.user.getIdToken();
        await axios.post("/auth/firebase", { idToken });

        return userCredential.user;
    };

    const loginWithEmail = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        setFirebaseUser(userCredential.user);

        const idToken = await userCredential.user.getIdToken();
        await axios.post("/auth/firebase", { idToken });

        return userCredential.user;
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        setFirebaseUser(userCredential.user);

        const idToken = await userCredential.user.getIdToken();
        await axios.post("/auth/firebase", { idToken });

        return userCredential.user;
    };

    const logout = async () => {
        await signOut(auth);
        setFirebaseUser(null);
        await axios.post("/auth/logout");
    };

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
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
