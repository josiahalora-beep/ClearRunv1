import React from "react";
import { useParams } from "react-router-dom";
import ExceptionDetail from "@/pages/ExceptionDetail";
import RouteIssueDetail from "@/pages/RouteIssueDetail";
import { routeIntelligenceExceptions } from "@/data/routeIntelligenceData";

export default function ExceptionRouter() {
  const { id } = useParams();
  const routeIssue = routeIntelligenceExceptions.find((item) => item.id === id);

  if (routeIssue) {
    return <RouteIssueDetail issue={routeIssue} />;
  }

  return <ExceptionDetail />;
}
