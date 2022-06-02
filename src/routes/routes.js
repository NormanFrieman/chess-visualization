import PublicRoutes from "./public";
import PrivateRoutes from "./private";

function RoutesConfig() {
    return (
        <div>
            <PublicRoutes/>
            <PrivateRoutes/>
        </div>
    );
}

export default RoutesConfig;