import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [productImg, setproductImg] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const amenities = [
    "Swimming Pool",
    "Roof-Top Gym",
    "Bebercue",
    "4 Bedroom DSQ",
  ];
  const navigate = useNavigate();
  const handleImageUpload = async (event) => {
    const files = [...event.target.files].map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    const response = await Promise.all(files);
    setproductImg(response);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const url = "http://localhost:5000/api/v2/createproduct";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyY2YxZDM4ZDhlYjE1NDRhNzBmOTc0MyIsInJvbGUiOiJ0cmF2ZWxsZXIiLCJpc19ob3N0Ijp0cnVlLCJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdDEyMzRAZ21haWwuY29tIiwic3VzcGVuZGVkIjpmYWxzZSwiaWF0IjoxNjU3NzgyMTIxLCJleHAiOjE2NjAzNzQxMjF9.3maAwIWzRjfkMMaVguBZpvmFkN_YPKnisncE4iituSA";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .post(
        url,
        {
          name: name,
          location: location,
          description: description,
          price: price,
          image: productImg,
          amenities: amenities,
        },
        config
      )
      .then((response) => {
        setMessage(response.data.message);
        setTimeout(() => {
          return navigate("/forgotpass");
        }, 5000);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  console.log(productImg);
  return (
    <div>
      <form encType="multipart/form-data" onSubmit={handleCreateProduct}>
        <div>
          <input
            type="file"
            multiple="multiple"
            accept="image/"
            onChange={handleImageUpload}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="price"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          {amenities &&
            amenities?.map((ameni) => {
              return <span key={ameni}>{ameni}</span>;
            })}
        </div>
        <button type="submit">CREATE PRODUCT</button>
      </form>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <div>
        {productImg &&
          productImg?.map((img) => {
            return <img key={img} src={img} alt={img} />;
          })}
      </div>
    </div>
  );
};

export default CreateProduct;
