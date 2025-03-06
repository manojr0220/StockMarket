import React, { useState, ChangeEvent, FormEvent } from "react";
import "./LoginScreen.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../UIkit/Logo/logo";
import { notify } from "../../UIkit/Toast/toast";
import Button from "../../UIkit/Button/Button";
import AWS from "aws-sdk";
interface FormData {
  username: string;
  password: string;
  usermail?: string;
}

interface Errors {
  username?: string;
  password?: string;
  usermail?: string;
}
const poolData = {
  UserPoolId: "eu-north-1_NNtm4CJTL",
  ClientId: "3kuu9kdf71sj1r816q436ajp54",
  clientScreate: "jr0h6e21q8l4pgnd7urogvmlclb1o128b6idmiu2vauce0kfn16",
  screatekey: "OQy4FmJsnrIPGV/fcHztAYDbalV4BSYhb1snaU4G",
  AWS_REGION: "eu-north-1",
  accesskey: "AKIA2MNVLRRNJ2TIQ3JS",
};

AWS.config.update({
  accessKeyId: poolData.accesskey,
  secretAccessKey: poolData.screatekey,
  region: poolData.AWS_REGION,
});
const LoginScreen: React.FC = () => {
  const navigation = useNavigate();
  AWS.config.update({ region: poolData.AWS_REGION });
  const cognito = new AWS.CognitoIdentityServiceProvider();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loader, setloader] = useState<any>(false);
  const [touched, setTouched] = useState<{
    username: boolean;
    password: boolean;
    usermail: boolean;
  }>({
    username: false,
    password: false,
    usermail: false,
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
      newErrors.username = "Username is required";
    }
    if (!formData.usermail) {
      newErrors.usermail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.usermail)) {
      newErrors.usermail = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const computeSecretHash = async (
    username: string,
    clientId: string,
    clientSecret: string
  ) => {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(clientSecret);
    const messageData = encoder.encode(username + clientId);

    const key = await window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await window.crypto.subtle.sign("HMAC", key, messageData);
    return btoa(String.fromCharCode(...new Uint8Array(signature))); // Convert to Base64
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setloader(true);
    e.preventDefault();
    setTouched({ username: true, password: true, usermail: true });

    if (validateForm()) {
      try {
        const secretHash = await computeSecretHash(
          formData.username,
          poolData.ClientId,
          poolData.clientScreate
        );
        const params = {
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: poolData.ClientId,
          AuthParameters: {
            USERNAME: formData.username,
            PASSWORD: formData.password,
            SECRET_HASH: secretHash,
          },
        };
        const result = await cognito.initiateAuth(params).promise();
        localStorage.setItem(
          "token",
          result.AuthenticationResult?.IdToken || ""
        );
        localStorage.setItem("username", formData.username || "");
        localStorage.setItem("mail", formData.usermail || "");
        navigation("/");
        setloader(false);
      } catch (error: any) {
        notify(error.message, "error", 3000);
        setloader(false);
        console.error("Login failed:", error.message);
      }
    } else {
      setloader(false);
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
          <input
            type="text"
            placeholder="Enter Username"
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
            marginBottom: touched.usermail && errors.usermail ? "0px" : "20px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Email"
            name="usermail"
            value={formData.usermail}
            onChange={handleChange}
          />
        </div>
        {touched.usermail && errors.usermail && (
          <span className="error">{errors.usermail}</span>
        )}
        <div
          className="input-group"
          style={{
            marginBottom: touched.password && errors.password ? "0px" : "20px",
          }}
        >
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
        <div
          style={{
            display: "flex",
            flexDirection: "row", 
            alignItems: "center",
          }}
        >
          {loader ? (
            <Button showLoader color={"#fff"} width={"328px"} />
          ) : (
            <Button
              labelName={"Log in"}
              onClick={handleSubmit}
              width={"328px"}
            />
          )}
        </div>
        <div className="auth-text">
          Don't have an account?
          <a className="forgot-signup-link" href={"/signup"}>
            {" "}
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
