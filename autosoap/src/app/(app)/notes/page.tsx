
import { getUserAuth } from "@/lib/auth/utils";

export default async function Notes() {
  const { session } = await getUserAuth();
  return (
    <main className="">
      <h1 className="text-2xl font-bold my-2">Notes</h1>
    </main>
  );
}
