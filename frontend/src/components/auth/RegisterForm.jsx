import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useRegister } from "../../hooks/useAuth";
import { getErrorMessage, validateEmail } from "../../utils/helpers";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const register = useRegister();

  const validate = () => {
    const next = {};
    if (!form.username) next.username = "Username is required.";
    else if (form.username.length < 3)
      next.username = "Username must be at least 3 characters.";
    if (!form.email) next.email = "Email is required.";
    else if (!validateEmail(form.email)) next.email = "Enter a valid email.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (form.confirm !== form.password)
      next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    register.mutate({
      username: form.username,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {register.isError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {getErrorMessage(register.error, "Registration failed.")}
        </div>
      )}

      <Input
        name="username"
        label="Username"
        icon={User}
        placeholder="ada_lovelace"
        autoComplete="username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        error={errors.username}
      />

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
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

      <Input
        name="confirm"
        type={showPassword ? "text" : "password"}
        label="Confirm password"
        icon={Lock}
        placeholder="Re-enter your password"
        autoComplete="new-password"
        value={form.confirm}
        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        error={errors.confirm}
      />

      <Button type="submit" className="w-full" loading={register.isPending}>
        Create account
      </Button>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </form>
  );
}
