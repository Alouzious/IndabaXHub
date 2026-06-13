import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useLogin } from "../../hooks/useAuth";
import { getErrorMessage, validateEmail } from "../../utils/helpers";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const validate = () => {
    const next = {};
    if (!form.email) next.email = "Email is required.";
    else if (!validateEmail(form.email)) next.email = "Enter a valid email.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    login.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {login.isError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {getErrorMessage(login.error, "Invalid email or password.")}
        </div>
      )}

      <Input
        name="email"
        type="email"
        label="Email"
        icon={Mail}
        placeholder="you@university.ac.ug"
        autoComplete="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
      />

      <div className="relative">
        <Input
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-3 top-9 text-slate-500 hover:text-slate-300"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <Button type="submit" className="w-full" loading={login.isPending}>
        Sign in
      </Button>

      <p className="text-center text-sm text-slate-400">
        New to IndabaXHub?{" "}
        <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
          Create an account
        </Link>
      </p>
    </form>
  );
}
