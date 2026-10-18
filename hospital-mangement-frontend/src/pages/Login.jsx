import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Activity, Eye, EyeOff, LockKeyhole, UserRound} from "lucide-react";
import api from "../services/api";

export default function login(){
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try{
            const response = await api.post("/api/auth/login",{
                username,
                password
            });
            const data = response.data;

            localStorage.setItem("token",data.token);
            localStorage.setItem(
                "user",
            JSON.stringify({
                userId: data.userId,
                username: data.username,
                roles: data.roles ?? [],
            })
        );

        navigate("/",{replace: true});
        }
        catch(err){
            setError(
                err.response?.data?.message || "Unable to sign in. Check your credentials and try again."
            );
        }
        finally{
            setLoading(false);
        }     
    }
    return(
        <main className="login-page">
        <section className="login-brand-panel">
            <div className="brand-lockup">
            <div className="brand-icon">
                <Activity size={26} />
            </div>
            <span>Care<span className="brand-accent">Point</span></span>
            </div>

            <div className="brand-message">
            <span className="eyebrow">HOSPITAL MANAGEMENT SYSTEM</span>
            <h1>Better care starts with better coordination.</h1>
            <p>
                Manage patients, appointments and hospital operations
                through one connected workspace.
            </p>
            </div>

            <div className="brand-footer">
            Secure access · Connected care · Organized workflows
            </div>
        </section>

        <section className="login-form-panel">
            <div className="login-form-wrap">
            <div className="mobile-brand brand-lockup">
                <div className="brand-icon">
                <Activity size={24} />
                </div>
                <span>Care<span className="brand-accent">Point</span></span>
            </div>

            <div className="login-heading">
                <span className="eyebrow">WELCOME BACK</span>
                <h2>Sign in to your account</h2>
                <p>Enter your credentials to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <label htmlFor="username">Username</label>
                <div className="input-with-icon">
                <UserRound size={18} />
                <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                />
                </div>

                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                <LockKeyhole size={18} />
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                </div>

                {error && (
                <div className="form-error" role="alert">
                    {error}
                </div>
                )}

                <button
                className="primary-button login-submit"
                type="submit"
                disabled={loading}
                >
                {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="login-note">
                Authorized hospital personnel only.
            </p>
            </div>
        </section>
        </main>
    );
}