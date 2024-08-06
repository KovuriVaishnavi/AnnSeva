import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./RequestForm.css"; // Import the CSS file
const RequestForm = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    receiverName: "john",
    receiverId: "60d5f60b8f634d3f0c8b4568",
    loc: "hyd",
    foodItems: [],
    quantity: 0,
    status: "open",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "foodItems") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((item) => item.trim()),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    if (submitted) {
      setFormData({
        receiverName: "john",
        receiverId: "60d5f60b8f634d3f0c8b4567",
        loc: "hyd",
        foodItems: [],
        quantity: 0,
        status: "open",
      });
      setSubmitted(false); // Reset submitted state
    }
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        "http://localhost:3001/api/request",
        {
          ...formData,
          receiverId: user._id,
          receiverName: user.name,
          loc: user.location,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log("Request submitted successfully", response.data);
      toast.success("Your request has been submitted successfully! 🌟 Your generous request is now being processed. Thank you for your patience and support!");
      setSubmitted(true); // Trigger useEffect to reset form and close modal

      // Redirect to homepage
      navigate('/homepage');
    } catch (error) {
      console.error("Error submitting request", error);
      toast.error(error.response?.data?.message || "Error submitting request");
      setSubmitted(true);
    }
  };

  return (
    <div>
      <div className="request-form-container">
        <h2>Submit a Request</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Food Items:
            <input
              type="text"
              name="foodItems"
              value={formData.foodItems.join(", ")}
              onChange={handleChange}
              placeholder="Please enter food items required (separated by comma)"
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Please enter quantity"
              required
            />
          </label>
          <input type="submit" className="btn btn-success">
          </input>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
