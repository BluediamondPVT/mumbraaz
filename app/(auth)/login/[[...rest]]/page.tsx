import { SignIn } from "@clerk/nextjs";

export const revalidate = 3600; // 1 ghante ke liye ISR cache

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <SignIn routing="path" path="/login" />
    </div>
  );
}