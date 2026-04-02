import { Outlet } from "react-router";
import { Toast } from "@base-ui/react";

import { ToastList } from "../components/ui/Toast";

const SloperLayout = () => {
  return (
    <Toast.Provider>
      <div className="bg-background text-foreground">
        <Outlet />
      </div>
      <Toast.Portal>
        <Toast.Viewport className="fixed top-auto right-[1rem] bottom-[1rem] z-10 mx-auto flex w-[250px] sm:right-[2rem] sm:bottom-[2rem] sm:w-[300px]">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
};

export default SloperLayout;
