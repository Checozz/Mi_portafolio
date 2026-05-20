import React from "react";
import Typewriter from "typewriter-effect";

const TypewriterComponent = ({ strings = ["Física Aplicada", "IA & Machine Learning", "Supercomputación", "Maker & Hardware"] }) => {
  return (
    <div className="notranslate mt-5 text-3xl font-bold">
      <Typewriter
        options={{
          strings,
          autoStart: true,
          loop: true,
        }}
      />
    </div>
  );
};

export default TypewriterComponent;
