import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

export const MomentConfig = ({ children }) => <>{children}</>;
