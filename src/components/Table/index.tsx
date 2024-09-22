import { Table, TableProps } from "react-bootstrap";

export default function MyTable(props: TableProps) {
  return <Table {...props} striped bordered hover responsive size="sm" />;
}
