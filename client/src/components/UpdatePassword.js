import axios from "axios";
import React, { useState, Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";

export const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [validUrl, setValidURL] = useState(false);
  const params = useParams();
  const url = `http://localhost:5000/api/v1/reset-password/${params.userid}/${params.token}`;

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    await axios
      .post(url, {
        password,
      })
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
    const verifyURL = async () => {
      try {
        await axios.get(url);
        setValidURL(true);
      } catch (error) {
        setValidURL(false);
      }
    };
    verifyURL();
  }, [params, url]);
  return (
    <Fragment>
      {validUrl ? (
        <>
          <div>
            <form onSubmit={handleUpdatePassword}>
              <div>
                <input
                  placeholder="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p>{error}</p>}
              {message && <p>{message}</p>}
              <div>
                <button type="submit">Upadte Password</button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          404 PAGE NOT found <p>Reasons your reset link has expired</p>
        </>
      )}
    </Fragment>
  );
};
