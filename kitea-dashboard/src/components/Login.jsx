import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import kiteaLogo from '../images/download.png';
import axios from "axios";
import api from '../api/axios';

export default function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // {setTimeout(() => {
        //     if (email === "mezz63928@gmail.com" && password === "123456") {
        //         onLoginSuccess({
        //             email: email,
        //             nom_complet: 'EZZOUKHRY Mouhssine',
        //             role: 'Agent Administratif Supply Chain'
        //         });
        //         navigate("/dashboard");
        //     } else {
        //         setError('Identifiants incorrects ou compte non synchronisé avec Active Directory (AD).');
        //     }
        //     setLoading(false);
        // }, 1000);}
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: email,
                mot_de_pass: password
            });
            if (response.data && response.data.token) {
                
                const userPayload = {
                    email: email,
                    nom_complet: response.data.user.nom_utilisateur,
                    role: response.data.user.role
                };
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('auth_user', JSON.stringify(userPayload));
                onLoginSuccess(userPayload, response.data.token);

                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                setError("Identifiants incorrects ou compte non synchronisé avec Active Directory (AD).");
            } else {
                setError("Impossible de joindre le serveur d'authentification centrale KITEA.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">

            <div className="bg-white w-full max-w-4xl min-h-[500px] rounded-2xl shadow-2xl flex overflow-hidden border border-gray-200">
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-white">
                    <div className="flex justify-center mt-2">
                        <div className="w-full max-w-[160px] h-16 flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2 border border-gray-100 shadow-sm">
                            <img
                                src={kiteaLogo}
                                alt="KITEA Logo Officiel"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4 my-auto px-4">
                        <div className="text-center mb-6">
                            <p className="text-xs text-gray-400 font-medium">
                                Veuillez remplir vos informations pour continuer
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-700 p-2.5 rounded-xl text-[11px] font-semibold text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email d'entreprise"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#E30613] focus:bg-white transition-all text-gray-800 font-medium"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe d'entreprise"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#E30613] focus:bg-white transition-all text-gray-800 font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs text-white ${loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-400 hover:bg-[#E30613]'
                                }`}
                        >
                            {loading ? "Connexion en cours..." : "S'authentifier"}
                        </button>
                    </form>

                    <div className="text-[10px] text-gray-400 text-center max-w-xs mx-auto leading-relaxed mt-4">
                        En vous connectant, vous acceptez nos conditions d'utilisation.
                    </div>
                </div>
                <div className="hidden md:flex w-1/2 bg-[#B12024] relative p-12 items-center overflow-hidden">
                    <div className="absolute w-64 h-64 bg-white/5 rounded-full -top-10 -left-10 pointer-events-none" />
                    <div className="absolute w-56 h-56 bg-white/5 rounded-full top-12 -left-12 pointer-events-none" />
                    <div className="absolute w-48 h-48 bg-white/5 rounded-full bottom-16 -right-8 pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-white text-3xl font-extrabold tracking-tight leading-snug max-w-sm">
                            Centrale Logistique <br />
                            <span className="font-light text-xl text-red-200">Gestion de Stock & Litiges</span>
                        </h2>
                    </div>
                </div>

            </div>
        </div>
    );
}