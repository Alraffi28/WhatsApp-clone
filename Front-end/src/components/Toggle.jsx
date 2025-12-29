import { useEffect, useState } from "react";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import "./Toggle.css";

export default function Toggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const newTheme = !prev;
      document.documentElement.setAttribute(
        "data-theme",
        newTheme ? "dark" : "light"
      );
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      <BsSunFill className="icon sun" />
      <BsMoonFill className="icon moon" />
      <div className={`toggle-circle ${dark ? "dark" : ""}`} />
    </div>
  );
}
