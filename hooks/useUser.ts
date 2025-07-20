import { useState } from "react";
import { useUpdateUserMutation, useUserQuery } from "../remote/users";

export const useUser = () => {
  const { data: user, isLoading } = useUserQuery();
  const { mutate: updateUser, isPending: isUpdatePending } =
    useUpdateUserMutation();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const handleEditClick = () => {
    setTempName(user?.name || "");
    setIsEditingName(true);
  };

  const handleUpdateName = () => {
    if (!tempName.trim()) return;

    try {
      updateUser({ name: tempName });
      setIsEditingName(false);
    } catch (error) {
      console.error("Name update failed:", error);
    }
  };

  const handleCancel = () => {
    setIsEditingName(false);
    setTempName("");
  };

  return {
    user,
    isLoading,
    isUpdatePending,
    isEditingName,
    tempName,
    setTempName,
    handleEditClick,
    handleUpdateName,
    handleCancel,
  };
};
