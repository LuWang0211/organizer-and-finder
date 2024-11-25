
import AuthProtectedComponent from "@/AuthProtectedComponent";
import LayoutClient from "@/app/house_layout/LayoutClient";
import { extractPathFromDirectory } from "@/utils/path";


export default function Layout(props: React.ComponentProps<typeof LayoutClient>) {
    return <AuthProtectedComponent route={extractPathFromDirectory(__dirname ) }>
        {<LayoutClient {...props} />}
    </AuthProtectedComponent>
}