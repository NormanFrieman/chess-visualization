import PublicRoutes from "./public";
import PrivateRoutes from "./private";
import './index.css';

function RoutesConfig() {
    return (
        <div className="main_content">
            <PublicRoutes/>
            <PrivateRoutes/>
        </div>
    );
}

export default RoutesConfig;