import React from "react";
import UserModal from "./UserModal";

const SeeUser = ({ user, onClose }) => {
  return <UserModal mode="view" user={user} onClose={onClose} />;
};

export default SeeUser;