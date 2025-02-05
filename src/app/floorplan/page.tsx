import PageClient from "@/app/floorplan/PageClient";
import AuthProtectedComponent from "@/AuthProtectedComponent";
import { extractPathFromDirectory } from "@/utils/path";

export default function Page() {
    return <AuthProtectedComponent route={extractPathFromDirectory(__dirname ) }>
        <PageClient />;
    </AuthProtectedComponent>
}