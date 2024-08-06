// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import "./styles/Login.css"; // Assuming you store the CSS in Auth.css

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpSuccessMessage, setOtpSuccessMessage] = useState("");

//   const handleSendOtp = async () => {
//     try {
//       await axios.post("http://localhost:3001/api/otp", { email });
//       setOtpSent(true);
//       setOtpSuccessMessage("OTP has been sent to your email.");
//     } catch (error) {
//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data);
//       } else {
//         setErrorMessage("Something went wrong. Please try again.");
//       }
//       console.error(error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:3001/api/otpVerify", { email, otp });
//       toast.success("Login successful.");
//       const response = await axios.post(
//         "http://localhost:3001/api/auth/login",
//         { email }
//       );
//       if (response.status !== 200) {
//         console.log(response.status);
//       } else {
//         console.log(response.data);
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         if (response.data.user.isAdmin)
//           window.location.href = "/admin"; // Redirect to home page or dashboard
//         else window.location.href = "/user-type-selection"; // Redirect to home page or dashboard
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data); // Set error message from server response
//       } else {
//         setErrorMessage("Something went wrong. Please try again."); // Fallback error message
//       }
//       console.error(error); // Log the error for debugging
//     }
//   };

//   return (
//     <div className="login-form-container">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <h2>Login</h2>
//         <div className="input-otp">
//           <input
//             placeholder="Enter your Email..."
//             type="email"
//             name="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <button type="button" onClick={handleSendOtp}>
//             Send OTP
//           </button>
//         </div>
//         <br />
//         {otpSent && (
//           <>
//             <label>
//               OTP:
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//               />
//             </label>
//             <p style={{ color: "green" }}>OTP has been sent to your email.</p>
//           </>
//         )}
//         <button type="submit">Login</button>
//       </form>
//       {errorMessage ? (
//         <p style={{ color: "red" }}>Something went wrong. Please try again.</p>
//       ) : (
//         <></>
//       )}
//     </div>
//   );
// };

// export default Login;
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "./styles/Login.css"; // Assuming you store the CSS in Auth.css

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      await axios.post("http://localhost:3001/api/otp", { email });
      setOtpSent(true);
      setOtpSuccessMessage("OTP has been sent to your email.");
      setIsSendingOtp(false);
    } catch (error) {
      setIsSendingOtp(false);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "An error occurred.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/otpVerify", { email, otp });
      toast.success("Login successful.");
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        { email }
      );
      if (response.status !== 200) {
        console.log(response.status);
      } else {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.user.isAdmin)
          window.location.href = "/admin"; // Redirect to home page or dashboard
        else window.location.href = "/user-type-selection"; // Redirect to home page or dashboard
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "An error occurred.");
      } else {
        setErrorMessage("Something went wrong. Please try again."); // Fallback error message
      }
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <div className="login-form-container">
      {!otpSent ? (
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
            <form className="login-form" onSubmit={handleSubmit}>
              <h2>Login</h2>
              <div className="input-otp">
                <input
                  placeholder="Enter your Email..."
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="button" onClick={handleSendOtp}>
                  Send OTP
                </button>
              </div>
              <br />
              {otpSent && (
                <>
                  <label>
                    OTP:
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </label>
                  <p style={{ color: "green" }}>{otpSuccessMessage}</p>
                </>
              )}
              <button type="submit">Login</button>
            </form>
          )}
        </>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label>
            OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
