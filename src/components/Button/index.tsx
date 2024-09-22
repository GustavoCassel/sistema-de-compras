import { useContext } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { DarkThemeContext } from "../../App";

export default function MyButton(props: ButtonProps) {
  const { isDarkMode } = useContext(DarkThemeContext);

  return (
    <Button variant={isDarkMode ? "outline-light" : "outline-dark"} {...props}>
      {props.children}
    </Button>
  );
}
