import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";

const Content = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">Current Theme: {theme}</h2>
      <p className="max-w-md mx-auto">
        This is an example of how to use <strong>useContext</strong> to share
        state between components without prop drilling.
      </p>
    </div>
  );
};

export default Content;
