import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default function ButtonCarregamento({
  onClick,
  children,
  loadingMessage = "Carregando...",
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (isLoading || !onClick) return;

    setIsLoading(true);

    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button disabled={isLoading} onClick={handleClick} {...props}>
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span className="ml-3">{loadingMessage}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
