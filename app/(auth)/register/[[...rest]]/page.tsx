import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <SignUp routing="path" path="/register" />
    </div>
  );
}