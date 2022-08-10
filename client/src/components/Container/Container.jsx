import React from "react";

// Exportando os componentes Container, Row e Col deste arquivo

// Este componente Container nos permite usar um container bootstrap sem nos preocuparmos com nomes de classes
function Container({ fluid, children }) {
  return (
    <div
      style={{ margin: "1rem 2rem 1rem 2rem", padding: "20px 40px 20px 40px" }}
      className={`container${fluid ? "-fluid" : ""}`}
    >
      {children}
    </div>
  );
}

export default Container;
