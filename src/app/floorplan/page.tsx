import AuthProtectedComponent from "@/AuthProtectedComponent";
import PageClient from "@/app/floorplan/PageClient";

export default function Page() {
  return (
    <AuthProtectedComponent>
      <PageClient />;
    </AuthProtectedComponent>
  );
}
