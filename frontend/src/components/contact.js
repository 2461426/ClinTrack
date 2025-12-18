
// src/components/user/UserContact.jsx
import React, { useState } from "react";

const UserContact = () => {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: Wire to backend if needed
    setSubmitted(true);
  };

  return (
    
  <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
    }}>
      <div style={{
       
        borderRadius: "12px",
       boxShadow: "10px 10px 10px 10px rgba(0,0,0,0.1)",       
         width: "500px",
        padding: "20px",
        textAlign: "center"
      }}>
        <h2 style={{
          background: "#007bff",
          color: "#fff",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "16px"
        }}>
          CONTACT US
        </h2>
        <div style={{ textAlign: "left", fontSize: "16px", lineHeight: "1.8" }}>
          <p>☎️ +123-456-7890</p>
        
           <p>🌐 www.Clintrials.com</p>
          <p>📧 clintrial@gmail.com</p>
          <p>🗺️ Chennai,TamilNadu,India</p>
        </div>
      </div>
    </div>
  );
};

export default UserContact;