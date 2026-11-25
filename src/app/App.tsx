import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LoginScreen } from "./components/LoginScreen";
import { SignUpFlow } from "./components/SignUpFlow";
import { fetchCurrentHostProfile } from "./services/hostApi";
import { clearHostSession, getHostAuthToken } from "./services/hostAuthStorage";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";
type AuthView = "login" | "signup";

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [authView, setAuthView] = useState<AuthView>("login");

  const validateStoredToken = async () => {
    const token = getHostAuthToken();

    if (!token) {
      setAuthView("login");
      setAuthStatus("unauthenticated");
      return;
    }

    try {
      await fetchCurrentHostProfile();
      setAuthStatus("authenticated");
    } catch {
      clearHostSession();
      setAuthView("login");
      setAuthStatus("unauthenticated");
    }
  };

  useEffect(() => {
    void validateStoredToken();
  }, []);

  const handleLoginSuccess = () => {
    setAuthStatus("authenticated");
  };

  const handleRequestSignUp = () => {
    setAuthView("signup");
  };

  const handleFinishSignUp = () => {
    setAuthStatus("authenticated");
  };

  if (authStatus === "checking") {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-8">
        <p className="text-white/70">Checking session...</p>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    if (authView === "signup") {
      return <SignUpFlow onFinish={handleFinishSignUp} />;
    }

    return (
      <LoginScreen onLoginSuccess={handleLoginSuccess} onRequestSignUp={handleRequestSignUp} />
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
