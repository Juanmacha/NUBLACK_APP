import React from "react";
import UserModal from "./UserModal";

const UserCreate = ({ onClose, onSubmit, users }) => {
  return <UserModal mode="create" onClose={onClose} onSave={onSubmit} users={users} />;
};

export default UserCreate;