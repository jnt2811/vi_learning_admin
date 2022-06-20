import { AntdConfig } from "./AntdConfig";
import { MomentConfig } from "./MomentConfig";

export const AppConfig = ({ children }) => {
  return (
    <MomentConfig>
      <AntdConfig>{children}</AntdConfig>
    </MomentConfig>
  );
};
