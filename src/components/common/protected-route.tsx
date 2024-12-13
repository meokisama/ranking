import React, { useState } from "react";
import "./styles/protected-route.scss";

interface ProtectedRouteProps {
  component: React.ComponentType<{ responseData: any }>;
}

interface AuthResponse {
  message: string;
  [key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [data, setData] = useState<any>(null);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ALL_RANK}?password=${password}`
      );
      const result: AuthResponse = await response.json();

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
              autoFocus
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;
