import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./CreateGroup.css"

export default function CreateGroup({ close, addChat }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // FETCH USERS (exclude logged-in user)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        const filtered = res.data.filter(
          (u) => u._id !== (currentUser._id || currentUser.id)
        );
        setUsers(filtered);
      } catch (err) {
        console.log("Error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  // TOGGLE USER SELECTION
  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // CREATE GROUP
  const createGroup = async () => {
    if (!groupName.trim()) {
      return setError("Group name is required");
    }

    if (selectedUsers.length < 2) {
      return setError("Select at least 2 users");
    }

    try {
      const res = await API.post("/chat/group", {
        chatName: groupName,
        users: selectedUsers,
      });

      addChat(res.data);
      close();
    } catch (err) {
      console.log("Error creating group", err);
      setError("Failed to create group");
    }
  };

  return (
    <>
    
      <h2>Create Group</h2>

      <input
        type="text"
        placeholder="Group name"
        value={groupName}
        onChange={(e) => {
          setGroupName(e.target.value);
          setError("");
        }}
        className="group-input"
      />

      <div className="group-users">
        {users.map((user) => (
          <label key={user._id} className="group-user">
            <input
              type="checkbox"
              checked={selectedUsers.includes(user._id)}
              onChange={() => toggleUser(user._id)}
            />
            <span>{user.username}</span>
          </label>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="group-actions">
        <button onClick={createGroup} className="new-btn">
          Create
        </button>
        <button onClick={close} className="new-btn">
          Cancel
        </button>
      </div>
    
    </>
  );
}
