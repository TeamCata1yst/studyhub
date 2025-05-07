"use client";
import React, { createContext, useState, useContext } from "react";

const FriendsUpdateContext = createContext({
  refreshFriends: () => {},
  triggerRefresh: () => {},
});

export const FriendsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refreshToken, setRefreshToken] = useState(0);

  const triggerRefresh = () => {
    setRefreshToken((prev) => prev + 1);
  };

  const refreshFriends = () => {
    return refreshToken;
  };

  return (
    <FriendsUpdateContext.Provider value={{ refreshFriends, triggerRefresh }}>
      {children}
    </FriendsUpdateContext.Provider>
  );
};

export const useFriendsUpdater = () => useContext(FriendsUpdateContext);
