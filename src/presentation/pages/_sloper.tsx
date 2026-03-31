import { Outlet } from "react-router";

const SloperLayout = () => {
  return (
    <div className="bg-background text-foreground">
      <Outlet />
    </div>
  );
};

export default SloperLayout;
