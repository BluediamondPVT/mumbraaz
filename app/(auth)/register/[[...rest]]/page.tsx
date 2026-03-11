import { SignUp } from "@clerk/nextjs";
export const revalidate = 3600; // 1 ghante ke liye ISR cache

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <SignUp routing="path" path="/register" />
    </div>
  );
}