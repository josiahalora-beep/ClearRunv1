import React from "react";
import { useParams } from "react-router-dom";
import ExceptionDetail from "@/pages/ExceptionDetail";
import RouteExceptionDetail from "@/pages/RouteExceptionDetail";
import { routeIntelligenceExceptions } from "@/data/routeIntelligenceData";

export default function ExceptionRouter() {
  const { id } = useParams();
  const routeException = routeIntelligenceExceptions.find((item) => item.id === id);

  if (routeException) {
    return <RouteExceptionDetail exception={routeException} />;
  }

  return <ExceptionDetail />;
}
