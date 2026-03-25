import { Outlet } from "react-router";

const SloperLayout = () => {
  return (
    <div className="bg-amber-200">
      <Outlet />
    </div>
  );
};

export default SloperLayout;
