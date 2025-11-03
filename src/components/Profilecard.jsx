import React from "react";
import ava1 from "../assets/avatar1.png";

export default function ProfileCard({ avatar = ava1 }) {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img src={avatar} alt="Profile" style={styles.image} />
      </div>
      <h2 style={styles.name}>Carl Caterpillar</h2>
      <p style={styles.text}>Windsurfer</p>
      <p style={styles.text}>Age: 35</p>
      <p style={styles.text}>Level: Pro</p>
      <button style={styles.button}>Edit Profile</button>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "1rem",
  },
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  name: { color: "#19306E", marginTop: "1rem" },
  text: { color: "#19306E", margin: "0.3rem 0" },
  button: {
    backgroundColor: "#19306E",
    color: "white",
    border: "none",
    borderRadius: "1rem",
    padding: "0.5rem 1rem",
    marginTop: "1rem",
    cursor: "pointer",
  },
};
