import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const Users = () => {
  const [customer, setCustomer] = useState("");
  //const[errorMessage,setErrorMessage] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    protectedRoute();
  }, []);

  async function protectedRoute() {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }
      let protectedResponse = await fetch(
        `${BASE_URL}/api/customers/protected`,
        {
          method: "GET",
          headers: {
            "Contentt-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (protectedResponse.status === 401) {
        ;//throw new Error("accessToken invali or expired, attempting refresh")
        //console.log("accessToken invali or expired, attempting refresh");
        accessToken = await refreshAccessToken();
        if(!accessToken){
          navigate('/login')
          return;
        }
        protectedResponse = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/protected`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
      const protectedData = protectedResponse.json()
      if (!protectedData.error) {
        setCustomer(protectedData.user);
        // ✅ Call getAllProducts API here
        //fetchProducts(accessToken);
      } else {
        console.log("Access denied.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function refreshAccessToken() {
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/refresh-token`, {
        method: "POST",
        credentials: "include", // important to send cookies!
      });
      if (!res.ok) throw new Error("Failed to refresh token");
      const data = await res.json();
      console.log(data);
      
      localStorage.setItem("accessToken", data.accessToken);

      return data.accessToken;
    } catch (error) {
      console.error("Refresh token failed:", error);
      return null;
    }
  }
  return (
    <div>
      <h1>{customer ? `welcome ${customer.fullName}` : "Loading"}</h1>
      <h2>Browse our products</h2>
    </div>
  );
};

export default Users;