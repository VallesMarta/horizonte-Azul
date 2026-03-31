"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p className="p-10 text-center">Cargando visor de API...</p>,
});

export default function ReactSwagger({ spec }: { spec: any }) {
  return <SwaggerUI spec={spec} />;
}
