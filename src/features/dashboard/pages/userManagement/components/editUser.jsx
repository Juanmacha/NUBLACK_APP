import React from "react";
import UserModal from "./UserModal";

const EditUser = ({ user, onClose, onSubmit }) => {
  return (
    <UserModal
      mode="edit"
      user={user}
      onClose={onClose}
      onSave={onSubmit}
    />
  );
};

export default EditUser;