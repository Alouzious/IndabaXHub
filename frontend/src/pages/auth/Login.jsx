import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <div>
      <h1 className="mb-1 text-center text-xl font-semibold text-white">
        Welcome back
      </h1>
      <p className="mb-6 text-center text-sm text-slate-400">
        Sign in to continue to your dashboard
      </p>
      <LoginForm />
    </div>
  );
}
