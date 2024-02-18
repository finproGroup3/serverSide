import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import axios from "axios";

function RegisterModal({ open, onClose }) {
  const initialFormData = {
    email: "",
    password: "",
    username: "",
    cityId: "",
    provinceId: "",
    address: "",
    role: "",
    referralCode: "",
    profilePicture: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      const response = await axios.post(
        "http://localhost:3000/users/register",
        formDataToSend
      );
      console.log(response.data); // or do something with the response

      // Menyimpan data ke local storage setelah berhasil mendaftar
      localStorage.setItem('registeredUser', JSON.stringify(formData));
      
      onClose();
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, onClose]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Dialog size="sm" open={open} onClose={onClose}>
      <Card ref={modalRef}>
        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            <Typography variant="h5">Register</Typography>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="Email"
              size="regular"
              required
              className="mb-4"
            />
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
              size="regular"
              required
              className="mb-4"
            />
            <Button
              onClick={togglePasswordVisibility}
              color="blue"
              size="regular"
              ripple="light"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </Button>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              label="Username"
              size="regular"
              required
              className="mb-4"
            />
            <Input
              type="text"
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              label="City ID"
              size="regular"
              required
              className="mb-4"
            />
            <Input
              type="text"
              name="provinceId"
              value={formData.provinceId}
              onChange={handleChange}
              label="Province ID"
              size="regular"
              required
              className="mb-4"
            />
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              label="Address"
              size="regular"
              required
              className="mb-4"
            />
            <Input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
              size="regular"
              required
              className="mb-4"
            />
            <Input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              label="Referral Code"
              size="regular"
              className="mb-4"
            />
            <Input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              label="Profile Picture"
              size="regular"
              required
              className="mb-4"
            />
          </CardBody>
          <CardFooter>
            <Button color="blue" type="submit" ripple="light">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Dialog>
  );
}

export default RegisterModal;
