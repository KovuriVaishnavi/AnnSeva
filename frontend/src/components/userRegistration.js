import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserRegistration.css"; // Ensure this CSS file is imported for styling

const UserRegistration = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSendingOtp(true);
    try {
      const response = await fetch("http://localhost:3001/api/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setIsSendingOtp(false);
      if (response.status === 200) {
        setIsOtpSent(true);
      } else {
        alert("Error sending OTP");
      }
    } catch (error) {
      setIsSendingOtp(false);
      console.error("Error:", error);
      alert("Error sending OTP");
    }
  };

  useEffect(() => {
    const getLocation = () => {
      setIsLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setError(null);
            setIsLoading(false);
          },
          (error) => {
            setError(error.message);
            setIsLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
        setIsLoading(false);
      }
    };
    getLocation();
  }, []);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch("http://localhost:3001/api/otpVerify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (response.ok) {
        const loca = { lat: latitude, long: longitude };

        response = await fetch("http://localhost:3001/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, ...loca }),
        });

        if (response.ok) {
          navigate("/login");
        } else {
          const result = await response.json();
          alert(result.msg || "Error creating user");
        }
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error validating OTP");
    }
  };

  return (
    <div className="registration-form-container">
      {!isOtpSent ? (
        <>
          {isSendingOtp ? (
            <div className="loading-message">
              <div className="spinner"></div>
              <h2>⏳ Just a Moment!</h2>
    <p>Good things take time. Your OTP is on its way and will arrive shortly...</p>
  
              <p>Your patience is appreciated!</p>
              <button className="refresh-button" onClick={() => window.location.reload()}>Refresh</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="registration-form">
              <h2>User Registration</h2>
              <label>
                Organisation Name / Name:
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  placeholder="Enter Your Mobile Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  placeholder="Enter Your Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">Register</button>
            </form>
          )}
        </>
      ) : (
        <form onSubmit={handleOtpSubmit} className="otp-form">
          <label>
            Enter OTP:
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit OTP</button>
        </form>
      )}
    </div>
  );
};

export default UserRegistration;
