import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginBody } from "../types/auth";

function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<LoginBody>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      navigate("/dashboard");
    } else {
      const data = await response.json();
      setErrorMessage(data.error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
        ></input>

        <input
          type="password"
          name="password"
          placeholder="password"
          value={loginData.password}
          onChange={handleChange}
        ></input>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Login;
