import React, { useState } from "react";
import "./styles/protected-route.scss";

const ProtectedRoute = ({ component: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ALL_RANK}?password=${password}`
      );
      const result = await response.json();
      if (result.message === "incorrectPassword") {
        setIsAuthenticated(false);
        window.alert("Incorrect password");
        setPassword("");
        setData(null);
      } else {
        setIsAuthenticated(true);
        setData(result);
      }
    } catch (error) {
      console.error("Error during authentication", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <Component responseData={data} />
      ) : (
        <div className="protected-route">
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;
