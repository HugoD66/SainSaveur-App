import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import "./App.css";

const App: React.FC = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    fetch("/api/recettes")
      .then((response) => {
        if (response.ok) {
          return response.json(); // Convertit la réponse en JSON
        }
        throw new Error("Réponse réseau non OK");
      })
      .then((data) => console.log(data)) // `data` est maintenant un objet JavaScript
      .catch((error) => console.error(error));

    fetch("/api/redis/test")
      .then((response) => {
        if (response.ok) {
          return response.json(); // Convertit la réponse en JSON
        }
        throw new Error("Réponse réseau non OK");
      })
      .then((data) => console.log(data)) // `data` est maintenant un objet JavaScript
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="App">
      {isSigningUp ? (
        <LoginPage onRegisterClick={() => setIsSigningUp(false)} />
      ) : (
        <RegisterPage onLoginClick={() => setIsSigningUp(true)} />
      )}
    </div>
  );
};

export default App;
