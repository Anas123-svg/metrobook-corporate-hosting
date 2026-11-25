import { FormEvent, useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { loginHost } from "../services/hostApi";
import { storeHostSession } from "../services/hostAuthStorage";

type LoginScreenProps = {
  onLoginSuccess: () => void;
  onRequestSignUp: () => void;
};

export function LoginScreen({ onLoginSuccess, onRequestSignUp }: LoginScreenProps) {
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!adminEmail.trim() || !password.trim()) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await loginHost(adminEmail.trim(), password);
      storeHostSession(response);
      onLoginSuccess();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-[#1C1C1C] rounded-2xl p-8 border border-[#27F5E8]/20">
        <div className="text-center mb-8">
          <div className="w-48 h-16 mx-auto mb-5 flex items-center justify-center">
            <img src="/logo4.png" alt="MetroBook" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl text-white font-['Playfair_Display'] mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to your corporate host account</p>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
          <div>
            <label className="block text-sm text-white/80 mb-2">Admin Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
              placeholder="john.admin@metro.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-[#27F5E8] text-[#0D0D0D] rounded-xl hover:bg-[#27F5E8]/90 transition-all shadow-lg shadow-[#27F5E8]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">Don't have an account?</p>
          <button
            type="button"
            onClick={onRequestSignUp}
            className="mt-2 text-[#27F5E8] hover:text-[#27F5E8]/90 transition-colors text-sm font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
