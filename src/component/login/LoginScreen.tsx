import React, { useState, ChangeEvent, FormEvent } from "react";
import "./LoginScreen.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../../UIkit/Logo/logo";
import Button from "../../UIkit/Button/Button";
import crypto from "crypto";
import AWS from "aws-sdk";

interface FormData {
  username: string;
  password: string;
}

interface Errors {
  username?: string;
  password?: string;
}
const poolData = {
  UserPoolId: "eu-north-1_NNtm4CJTL",
  ClientId: "3kuu9kdf71sj1r816q436ajp54",
  clientScreate: "jr0h6e21q8l4pgnd7urogvmlclb1o128b6idmiu2vauce0kfn16",
  AWS_REGION: "eu-north-1",
};
const LoginScreen: React.FC = () => {
  const navigation = useNavigate();
  AWS.config.update({ region: poolData.AWS_REGION });
  const cognito = new AWS.CognitoIdentityServiceProvider();
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

  const calculateSecretHash = async (username: string) => {
    const secret = poolData.clientScreate;
    const message = new TextEncoder().encode(username + poolData.ClientId);
    const key = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const hashBuffer = await window.crypto.subtle.sign("HMAC", key, message);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  };
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ username: true, password: true });

    if (validateForm()) {
      const secretHash = calculateSecretHash(formData.username);
      try {
        const result = await cognito
          .initiateAuth({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: poolData.ClientId,
            AuthParameters: {
              USERNAME: formData.username,
              PASSWORD: formData.password,
            },
          })
          .promise();

        console.log("Login successful!", result);
        localStorage.setItem(
          "token",
          result.AuthenticationResult?.IdToken || ""
        );

        alert("Login successful!");
        navigation("/dashboard");
      } catch (error: any) {
        console.error("Login failed:", error.message);
        alert("Login failed: " + error.message);
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
            marginBottom: touched.username && errors.username ? "0px" : "20px",
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
            marginBottom: touched.password && errors.password ? "0px" : "20px",
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
        <Button labelName={"Login"} onClick={handleSubmit} width={"90px"} />
      </form>
    </div>
  );
};

export default LoginScreen;
