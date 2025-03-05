import React, { useState } from "react";
import "./SignupScreen.css";
import axios from "axios";
import Logo from "../../UIkit/Logo/logo";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  email: string;
  password: string;
  cnfm_password: string;
  mobile: string;
  pan: string;
  aadhar: string;
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  cnfm_password?: string;
  mobile?: string;
  pan?: string;
  aadhar?: string;
  general?: string;
}

const SignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    cnfm_password: "",
    mobile: "",
    pan: "",
    aadhar: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof Errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    let newErrors: Errors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.cnfm_password) {
      newErrors.cnfm_password = "Confirm Password is required";
    } else if (formData.password !== formData.cnfm_password) {
      newErrors.cnfm_password = "Passwords do not match";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!/^\d{12}$/.test(formData.aadhar)) {
      newErrors.aadhar = "Aadhar number must be 12 digits";
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = "Invalid PAN format (ABCDE1234F)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setSuccessMessage("");
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/auth/api/register/",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response:", response.data);
        setSuccessMessage("Registration successful!");
        navigate("/login");
        setFormData({
          username: "",
          email: "",
          password: "",
          cnfm_password: "",
          mobile: "",
          pan: "",
          aadhar: "",
        });
      } catch (error: any) {
        console.error("Error:", error.response?.data || error.message);
        setErrors(error.response?.data || { general: "Registration failed" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="logo">
        <Logo fontSize={50} />
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={{ marginBottom: errors.username ? "0px" : "20px" }}
        />
        {errors.username && <span className="error">{errors.username}</span>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ marginBottom: errors.email ? "0px" : "20px" }}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          style={{ marginBottom: errors.mobile ? "0px" : "20px" }}
        />
        {errors.mobile && <span className="error">{errors.mobile}</span>}

        <input
          type="text"
          name="aadhar"
          placeholder="Aadhar Number"
          value={formData.aadhar}
          onChange={handleChange}
          style={{ marginBottom: errors.aadhar ? "0px" : "20px" }}
        />
        {errors.aadhar && <span className="error">{errors.aadhar}</span>}

        <input
          type="text"
          name="pan"
          placeholder="PAN Number"
          value={formData.pan}
          onChange={handleChange}
          style={{ marginBottom: errors.pan ? "0px" : "20px" }}
        />
        {errors.pan && <span className="error">{errors.pan}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ marginBottom: errors.password ? "0px" : "20px" }}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <input
          type="password"
          name="cnfm_password"
          placeholder="Confirm Password"
          value={formData.cnfm_password}
          onChange={handleChange}
          style={{ marginBottom: errors.cnfm_password ? "0px" : "20px" }}
        />
        {errors.cnfm_password && (
          <span className="error">{errors.cnfm_password}</span>
        )}
        <button type="submit" className="signup-button" disabled={loading}>
          Sign Up
        </button>

        {errors.general && <p className="error">{errors.general}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default SignupScreen;
