import React from "react";

export default function IntakeForm({ profile, setProfile }) {
  return (
    <div style={{ padding: 20, border: "1px solid #ddd", width: "250px" }}>
      <h2>Patient Profile</h2>

      <label>Age:</label><br/>
      <input
        value={profile.age}
        onChange={(e) => setProfile({ ...profile, age: e.target.value })}
      />
      <br/><br/>

      <label>Sex at birth:</label><br/>
      <input
        value={profile.sex_at_birth}
        onChange={(e) => setProfile({ ...profile, sex_at_birth: e.target.value })}
      />
      <br/><br/>

      <label>Allergies:</label><br/>
      <input
        value={profile.allergies}
        onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
      />
      <br/><br/>
    </div>
  );
}