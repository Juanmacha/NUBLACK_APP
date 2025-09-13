import React from "react";
import UserModal from "./UserModal";

const EditUser = ({ user, onClose, onSubmit, users }) => {
  return (
    <UserModal
      mode="edit"
      user={user}
      onClose={onClose}
      onSave={onSubmit}
      users={users}
    />
  );
};

export default EditUser;