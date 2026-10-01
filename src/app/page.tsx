import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";

export default async function Home() {
  const user = await requireUser();

  redirect("/dashboard");
}