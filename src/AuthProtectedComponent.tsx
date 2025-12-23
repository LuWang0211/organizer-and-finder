import { PreLoginHelper } from "./app/login/RedirectHelper";
import { getSession } from "./auth";

interface AuthProtectedComponentProps {
  children: React.ReactNode;
}

export default async function AuthProtectedComponent({
  children,
}: AuthProtectedComponentProps) {
  const session = await getSession();

  if (!session) {
    return <PreLoginHelper />;
  }

  return <>{children}</>;
}
