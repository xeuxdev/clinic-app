import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type User = {
  fullName: string;
  userId: string;
  accountId: string;
  phoneNumber: string;
  role: "attendant" | "doctor";
};

type UserContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const STORAGE_KEY = "app_user_v1";

const isValidUser = (obj: any): obj is User =>
  obj &&
  typeof obj.fullName === "string" &&
  typeof obj.userId === "string" &&
  typeof obj.accountId === "string" &&
  obj.phoneNumber === "string";

const loadUserFromStorage = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage());

  // Persist to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Keep state in sync across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const newVal = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(isValidUser(newVal) ? newVal : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
