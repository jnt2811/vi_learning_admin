import { useEffect } from "react";
import { withRouter } from "react-router-dom";

export const ScrollToTop = withRouter(({ history }) => {
  useEffect(() => {
    return history.listen(() => window.scrollTo(0, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
});

export const ClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });

  const handleClick = (e) => {
    if (!!ref.current && !ref.current.contains(e.target)) onClickOutside();
    return;
  };
};
