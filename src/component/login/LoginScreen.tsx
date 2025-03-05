import React, { useState, ChangeEvent, FormEvent } from "react";
import "./LoginScreen.css";
import axios from "axios";
import Logo from "../../UIkit/Logo/logo";
import Button from "../../UIkit/Button/Button";
import { COLORS } from "../../UIkit/color/color";

interface FormData {
  username: string;
  password: string;
}

interface Errors {
  username?: string;
  password?: string;
}

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{
    username: boolean;
    password: boolean;
  }>({
    username: false,
    password: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof Errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    let newErrors: Errors = {};
    if (!formData.username) {
      newErrors.username = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
      newErrors.username = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ username: true, password: true });

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/auth/api/login/",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        localStorage.setItem("token", response.data.access);
        localStorage.setItem("is_admin", response.data.user.is_admin);
        window.location.href = "/Dashboard";

        alert("Login successful!");
      } catch (error: any) {
        console.error("Login Error:", error.response?.data || error.message);
        alert("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <Logo fontSize={50} />
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div
          className="input-group"
          style={{
            marginBottom:
              touched.username && errors.username ? "0px" : "20px",
          }}
        >
          {formData.username && <label className="focused">Email</label>}
          <input
            type="text"
            placeholder="Enter email"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        {touched.username && errors.username && (
          <span className="error">{errors.username}</span>
        )}
        <div
          className="input-group"
          style={{
            marginBottom:
              touched.password && errors.password ? "0px" : "20px",
          }}
        >
          {formData.password && <label className="focused">Password</label>}
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
        <Button
          labelName={"Login"} 
          onClick={handleSubmit}
          width={"90px"}
        />
      </form>
    </div>
  );
};

export default LoginScreen;
