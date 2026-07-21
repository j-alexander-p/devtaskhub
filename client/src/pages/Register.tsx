import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterBody } from "../types/auth";

function Register() {
  const [formData, setFormData] = useState<RegisterBody>({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate("/login");
    } else {
      console.log("Registration failed");
    }
  }

  return;
  <div></div>;
}

export default Register;
