import React, { useState } from "react";
import "./SignupScreen.css";
import Logo from "../../UIkit/Logo/logo";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
import CryptoJS from "crypto-js";
import Button from "../../UIkit/Button/Button";
import { notify } from "../../UIkit/Toast/toast";
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

const SignupScreen: React.FC = () => {
  const computeSecretHash = (username: string) => {
    return CryptoJS.HmacSHA256(
      username + poolData.ClientId,
      poolData.clientScreate
    ).toString(CryptoJS.enc.Base64);
  };
  const navigate = useNavigate();
  const [loader, setloader] = useState<any>(false);
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

  const cognito = new AWS.CognitoIdentityServiceProvider();
  const formatPhoneNumber = (phone: string): string => {
    // Ensure phone number starts with country code, e.g., "+46" for Sweden
    if (!phone.startsWith("+")) {
      return `+91${phone.replace(/^0+/, "")}`; // Remove leading zero if present
    }
    return phone;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setloader(true);
    e.preventDefault();

    if (!validateForm()) {
      setloader(false);
      return;
    } else {
      setLoading(true);
      setSuccessMessage("");

      const { username, email, password, mobile, pan, aadhar } = formData;
      localStorage.setItem("username", username);
      const secretHash = computeSecretHash(username);

      const formattedMobile = formatPhoneNumber(mobile); // Ensure correct phone format

      const params = {
        ClientId: poolData.ClientId,
        SecretHash: secretHash,
        Username: username,
        Password: password,
        UserAttributes: [
          { Name: "name", Value: username }, // ✅ Add name attribute
          { Name: "email", Value: email },
          { Name: "phone_number", Value: formattedMobile },
          { Name: "custom:pan", Value: String(pan) },
          { Name: "custom:aadhar", Value: String(aadhar) },
        ],
      };
      try {
        await cognito.signUp(params).promise();
        await confirmUserAdmin(username);
        setSuccessMessage(
          "Registration successful! Check your email for the confirmation code."
        );
        navigate("/login");
        setloader(false);
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
        setloader(false);
        notify(error.message, "error", 3000);
        console.error("Signup failed:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmUserAdmin = async (username: string) => {
    const param = {
      UserPoolId: poolData.UserPoolId,
      Username: username,
    };

    try {
      const result = await cognito.adminConfirmSignUp(param).promise();
    } catch (error: any) {
      console.error("Admin confirmation failed:", error.message);
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
        {loader ? (
          <Button showLoader color={"#fff"} width={"328px"} />
        ) : (
          <Button
            type="submit"
            labelName={"Sign up"}
            color={"#fff"}
            width={328}
            disabled={loading}
          ></Button>
        )}
        <div className="auth-text">
          Already have an account?{" "}
          <a className="forgot-signup-link" href={"/login"}>
            {" "}
            Log in
          </a>
        </div>
        {errors.general && <p className="error">{errors.general}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default SignupScreen;
