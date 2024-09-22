import { Container, Spinner, SpinnerProps } from "react-bootstrap";

export default function Loading(props: SpinnerProps) {
  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status" {...props}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
}
