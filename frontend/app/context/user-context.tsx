import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

type User = {
  fullName: string;
  userId: number;
  accountId: number;
  phoneNumber: string;
  role: "attendant" | "doctor";
};

type UserContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const STORAGE_KEY = "app_user_v1";

const loadUserFromStorage = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage synchronously on mount (before render)
  useLayoutEffect(() => {
    const storedUser = loadUserFromStorage();
    console.log(storedUser);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  // Persist to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  if (isLoading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
};
