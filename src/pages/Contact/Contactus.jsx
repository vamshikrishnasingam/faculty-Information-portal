// Contactus.js

import React, { useState } from "react";
import "./Contactus.css";

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to a server)

    // For demonstration purposes, log the form data to the console
    console.log("Form Data:", formData);
  };

  return (
    <div className="custom-container">
      <h2 className="custom-heading">Contact Us</h2>
      <form className="custom-form" onSubmit={handleSubmit}>
        <label className="custom-label" htmlFor="name">
          Your Name:
        </label>
        <input
          className="custom-input"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="custom-label" htmlFor="email">
          Your Email:
        </label>
        <input
          className="custom-input"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="custom-label" htmlFor="message">
          Your Message:
        </label>
        <textarea
          className="custom-textarea"
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <input className="custom-submit" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Contactus;
