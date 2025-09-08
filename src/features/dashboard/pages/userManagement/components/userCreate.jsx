import React from "react";
import UserModal from "./UserModal";

const UserCreate = ({ onClose, onSubmit }) => {
  return <UserModal mode="create" onClose={onClose} onSave={onSubmit} />;
};

export default UserCreate;