
import AuthProtectedComponent from "@/AuthProtectedComponent";
import LayoutClient from "@/app/house_layout/LayoutClient";


export default function Layout(props: React.ComponentProps<typeof LayoutClient>) {
    return <AuthProtectedComponent route={"/house_layout"}>
        {<LayoutClient {...props} />}
    </AuthProtectedComponent>
}