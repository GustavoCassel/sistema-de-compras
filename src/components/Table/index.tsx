import { useContext } from "react";
import { Table, TableProps } from "react-bootstrap";
import { DarkThemeContext } from "../../App";

export default function MyTable(props: TableProps) {
  const { isDarkMode } = useContext(DarkThemeContext);

  return <Table {...props} striped bordered hover responsive size="sm" variant={isDarkMode ? "dark" : "light"} />;
}
