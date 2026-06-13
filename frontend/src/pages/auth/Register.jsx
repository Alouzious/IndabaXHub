import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
  return (
    <div>
      <h1 className="mb-1 text-center text-xl font-semibold text-white">
        Create your account
      </h1>
      <p className="mb-6 text-center text-sm text-slate-400">
        Start sharing datasets and joining competitions
      </p>
      <RegisterForm />
    </div>
  );
}
