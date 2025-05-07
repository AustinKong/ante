import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

type User = {
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const { accessToken, user } = await response.json();
    localStorage.setItem("token", accessToken);
    setUser(user);
  };

  const register = async (email: string, password: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Registration failed");

    const { accessToken, user } = await response.json();
    localStorage.setItem("token", accessToken);
    setUser(user);
  };

  const logout = async () => {
    // TODO: Add logout endpoint
    localStorage.removeItem("token");
  };

  const refreshAccessToken = async () => {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      localStorage.setItem("token", accessToken);
      return accessToken;
    }

    return null;
  };

  // Helper function for fetch calls to restricted endpoints
  // Automatically attaches access token to requests and refreshes if expired
  const authFetch = async (
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> => {
    const accessToken = localStorage.getItem("token");

    const response = await fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();

      if (!newAccessToken) {
        logout();
        throw new Error("Unauthorized");
      }

      return fetch(input, {
        ...init,
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }

    return response;
  };

  const checkAuth = async () => {
    const accessToken = localStorage.getItem("token");

    if (!accessToken) return false;

    const response = await authFetch("/api/auth/user");

    if (!response.ok) {
      logout();
      return false;
    }
    const { user } = await response.json();
    setUser(user);
    return true;
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) return;

    const fetchUser = async () => {
      const response = await authFetch("/api/auth/user");

      if (!response.ok) {
        logout();
        return;
      }

      const { user } = await response.json();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, authFetch, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
