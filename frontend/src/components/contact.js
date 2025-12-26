
// src/components/user/UserContact.jsx
import React, { useState } from "react";
import Menu from "./Menu";
import ParticipantNavbar from "./ParticipantNavbar/ParticipantNavbar";

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
   <div>
    <ParticipantNavbar/>

  <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      marginBottom:"100px",
      paddingTop:"70px"
    }}>
      <div style={{
       
        borderRadius: "12px",
       
        boxShadow:
        "inset rgba(0, 0, 0, 0.1) -14px -8px 18px 11px",
       
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
    <div className="clintrack-page__banner">
          <div className="container py-3 text-center">
            <p className="m-0 clintrack-page__banner-text">
              All the trials are conducted according to FDA and ICH-GCP guidelines.
            </p>
          </div>
          <div className="container-copyright">
          <small>© {new Date().getFullYear()} Clin Track. All rights reserved.</small>
        </div>
        </div>
    </div> 
  );
};

export default UserContact;