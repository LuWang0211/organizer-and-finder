import PageClient from "@/app/floorplan/PageClient";
import AuthProtectedComponent from "@/AuthProtectedComponent";

export default function Page() {
    return <AuthProtectedComponent>
        <PageClient />;
    </AuthProtectedComponent>
}