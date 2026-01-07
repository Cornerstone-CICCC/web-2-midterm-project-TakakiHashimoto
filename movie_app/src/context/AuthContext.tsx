import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
} from "react";
import { getMe } from "../../api";

// Defining types
type User = {
  id: number;
  email: string;
  name: string;
};

type AuthType = {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

// Creating context
// This does the following:
// Auth = {
//   $$typeof: Symbol(react.context)
//   _currentValue: null, ==> Later it becomes values to be passed around children == {user, setUser, loading}
//   Provider: function provide(){}
//   Consumer: function Consumer(){}
// }
const Auth = createContext<AuthType | null>(null);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const returnedUser = await getMe(); // get looged-in user
        setUser(returnedUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  // React will call the passed func on initial render and from next renders, React will return the same value unless the dependencies change
  const value = useMemo(() => ({ user, loading, setUser }), [user, loading]);

  return <Auth.Provider value={value}>{children}</Auth.Provider>;
}

function useAuth() {
  const context = useContext(Auth);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
export { AuthContextProvider, useAuth };
