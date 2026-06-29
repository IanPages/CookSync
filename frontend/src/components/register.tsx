import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { registerUser, loginWithGoogle } from '../../services/user_services'
import { Link } from "react-router-dom"
import { useAuth } from "../context/auth_context"

declare global {
    interface Window {
        google?: any;
    }
}

export default function Register() {

    const [email, setEmail] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const navigate = useNavigate()
    const { login } = useAuth()
    const regexCaracterEspecial = /[^A-Za-z0-9]/

    const handleGoogleCallback = async (response: any) => {
        try {
            const result = await loginWithGoogle({ id_token: response.credential });
            login(result.user, result.access_token);
            toast.success("Logged in with Google successfully!");
            navigate("/");
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Failed to login with Google");
        }
    };

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
                    callback: handleGoogleCallback,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("googleSignInButton"),
                    { theme: "outline", size: "large", width: 320 }
                );
            }
        };

        if (window.google) {
            initializeGoogleSignIn();
        } else {
            const interval = setInterval(() => {
                if (window.google) {
                    initializeGoogleSignIn();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email || !password || !username) {
            toast.error("Please fill in all fields");
            return
        } else if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return
        } else if (password.length < 8 || !regexCaracterEspecial.test(password)) {
            toast.error("Password must be at least 8 characters long and contain at least one special character.");
            return
        }
        try {
            await registerUser({ username, email, password });
            toast.success("Register successful");
            navigate("/login");
        } catch (error) {
            toast.error("Error")
        } finally {
            setPassword("")
            setConfirmPassword("")
            setEmail("")
            setUsername("")
        }

    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="flex flex-col gap-6 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-cook-muted text-3xl font-bold text-center">Login</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 pr-12"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium select-none"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                    <div className="relative w-full">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 pr-12"
                        />
                        <span
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium select-none"
                        >
                            {showConfirmPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-cook-primary hover:bg-cook-accent text-white font-semibold p-3 rounded-lg transition duration-200 shadow-md cursor-pointer"
                    >
                        Register
                    </button>
                </form>
                <div className="flex flex-col items-center justify-center my-2">
                    <div id="googleSignInButton"></div>
                </div>
                <p className="text-center text-gray-600">
                    Do you already have an account?{" "}
                    <Link to="/login" className=" font-semibold">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}