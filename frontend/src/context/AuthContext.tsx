'use client';
import { signInApi, signInByGoogleApi, signUpApi, userApi } from "@/apis/apis";
import { Patient, SignInRequest, SignUpRequest, UserSession } from "@/types/type";
import { CodeResponse } from "@react-oauth/google";
import { AxiosError } from "axios";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
    userSession: UserSession | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (SignInRequest: SignInRequest) => Promise<boolean>;
    signup: (SignUpRequest: SignUpRequest) => Promise<boolean>;
    logout: () => void;
    getUser: () => Promise<Patient | null>;
    googleLogin: (codeResponse: CodeResponse, role: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userSession, setUserSession] = useState<UserSession | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const decodeJwt = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const storedSession = localStorage.getItem("userSession");
        if (storedSession) {
            const session = JSON.parse(storedSession);
            setUserSession(session);
            const decoded = decodeJwt(session.token);
            setIsAdmin(decoded && decoded.role === "Admin");
        }
    }, []);

    const login = async (signInRequest: SignInRequest): Promise<boolean> => {
        try {
            const response = await signInApi(signInRequest);

            if (response) {
                const { message, userDetails } = response.data;
                setUserSession(userDetails);
                localStorage.setItem("userSession", JSON.stringify(userDetails));
                const decoded = decodeJwt(userDetails.token);
                setIsAdmin(decoded && decoded.role === "Admin");
                return true;
            }

            return false;
        } catch (error) {
            console.log(error);
        }

        return false;
    }

    const googleLogin = async (codeResponse: CodeResponse, role: string): Promise<boolean> => {
        try {
            const response = await signInByGoogleApi(codeResponse.code, role);

            if (response) {
                const { message, userDetails } = response.data;
                setUserSession(userDetails);
                localStorage.setItem("userSession", JSON.stringify(userDetails));
                const decoded = decodeJwt(userDetails.token);
                setIsAdmin(decoded && decoded.role === "Admin");
                return true;
            }

            return false;
        } catch (error) {
            console.log(error);
        }

        return false;
    }

    const getUser = async (): Promise<Patient | null> => {
        try {
            const response = await userApi();
            const patient: Patient = response.data.user;

            if(response.data.success && !patient) {
                console.log("Unable to load the user");
                return null;
            } 
            else if(!response.data.success) {
                throw new Error(response.data.error);
            }

            return patient;
        } catch (error) {
            if(error instanceof AxiosError) {
                if(error.response?.data.error.includes('jwt expired')) {
                    throw new Error("jwt expired");
                }
                else {
                    console.warn(error);
                }
            }
        }

        return null;
    }

    const signup = async (signUpRequest: SignUpRequest): Promise<boolean> => {
        try {
            const response = await signUpApi(signUpRequest);

            if (response) {
                const { message, userDetails } = response.data;
                setUserSession(userDetails);
                const decoded = decodeJwt(userDetails.token);
                setIsAdmin(decoded && decoded.role === "Admin");
                return true;
            }
        } catch (error) {
            console.log(error);
        }

        return false;
    }

    const logout = (): void => {
        try {
            localStorage.removeItem("userSession");
            setUserSession(null);
            setIsAdmin(false);
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const value = {
        userSession,
        isAuthenticated: !!userSession,
        isAdmin,
        login,
        signup,
        logout,
        googleLogin,
        getUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("⚠️ useAuth() called outside of <AuthProvider>.");
    } else {
        return context;
    }
}