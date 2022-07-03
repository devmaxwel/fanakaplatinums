import axios from "axios";
import React, { useState } from "react";

const ForgortPass = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const url = "http://localhost:5000/api/v1/reset-password/reset-link";
    await axios
      .post(url, {
        email,
      })
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <div>
      <form onSubmit={handleForgotPassword}>
        <div>
          <input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>
        {error && <p>{error}</p>}
        {message && <p>{message}</p>}
        <div>
          <button type="submit">Request Reset Password Link</button>
        </div>
      </form>
    </div>
  );
};

export default ForgortPass;
