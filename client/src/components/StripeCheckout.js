import axios from "axios";
import React from "react";

const StripeCheckout = () => {
  const images = [
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPRYH6JDGMfWnVuXCzlpNzZzAc0lqB_y8iyg&usqp=CAU",
      secure_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPRYH6JDGMfWnVuXCzlpNzZzAc0lqB_y8iyg&usqp=CAU",
    },
    {
      url: "http://res.cloudinary.com/devmaxwel/image/upload/v1657357083/fanakaplatinums/u6g4ktn8ggyal2iawjof.png",
      secure_url:
        "https://res.cloudinary.com/devmaxwel/image/upload/v1657357083/fanakaplatinums/u6g4ktn8ggyal2iawjof.png",
    },
    {
      url: "http://res.cloudinary.com/devmaxwel/image/upload/v1657357083/fanakaplatinums/odm35cjdrqpgf1thaxve.png",
      secure_url:
        "https://res.cloudinary.com/devmaxwel/image/upload/v1657357083/fanakaplatinums/odm35cjdrqpgf1thaxve.png",
    },
  ];
  const bookings = [
    {
      id: "fghjk23456890bc3",
      name: "Dennis Pritt",
      description: "Pent Glass House",
      price: 56,
      days: 10,
      image: images[0].secure_url,
    },
  ];

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyY2YxZDM4ZDhlYjE1NDRhNzBmOTc0MyIsInJvbGUiOiJ0cmF2ZWxsZXIiLCJpc19ob3N0Ijp0cnVlLCJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdDEyMzRAZ21haWwuY29tIiwic3VzcGVuZGVkIjpmYWxzZSwiaWF0IjoxNjU3NzgzMDgyLCJleHAiOjE2NjAzNzUwODJ9.70krwQm-Hv9u4xFGeVlvEUpeZJvlD-28C7Y0r6jMwsE";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const handleCheckOut = async () => {
    const url = "http://localhost:5000/api/v3/create-checkout-session";
    await axios
      .post(
        url,
        {
          bookings,
        },
        config
      )
      .then((onfullfilled) => {
        if (onfullfilled.data.url) {
          return (window.location.href = onfullfilled.data.url);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <button onClick={() => handleCheckOut()}>Stripe Checkout</button>
    </div>
  );
};

export default StripeCheckout;
