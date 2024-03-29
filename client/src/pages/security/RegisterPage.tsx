import React, { useState, FC, useEffect } from "react";
import logo from "../../logo.svg";
import { checkPasswordStrength } from "./check-methods/checkPasswordStrength";
import { useNavigate } from "react-router";
import io from "socket.io-client";
const socket = io("http://localhost:4700");
interface RegisterPageProps {}

const RegisterPage: FC<RegisterPageProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:4700");

    socket.on("newUserCreated", (data) => {
      alert(data.message);
    });
    return () => {
      socket.off("newUserCreated");
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!checkPasswordStrength(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, dont des lettres majuscules et minuscules, des chiffres et des caractères spéciaux.",
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4700/api/security/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, password }),
        },
      );

      if (!response.ok) {
        setError("Erreur lors de l'enregistrement");
        throw new Error("Erreur lors de l'enregistrement");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);

      socket.emit("registerUserSocket", data.user._id);
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de l'envoi des données", error);
      setError("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="username">Pseudo</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            S'inscrire
          </button>
        </form>
        <p className="login-prompt">
          Si vous avez déjà un compte,{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            cliquez ici
          </span>{" "}
          pour vous connecter.
        </p>
        {error && <p className="error-message">{error}</p>}
      </div>
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
};

export default RegisterPage;
