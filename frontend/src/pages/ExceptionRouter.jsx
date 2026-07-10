import React from "react";
import { useParams } from "react-router-dom";
import TicketIssueDetail from "@/pages/TicketIssueDetail";
import RouteIssueWorkflow from "@/pages/RouteIssueWorkflow";
import { routeExceptionQueue } from "@/data/mockData";
import { routeIntelligenceExceptions } from "@/data/routeIntelligenceData";
import { readCapturedRouteIssues } from "@/data/routeIssueCaptureData";

export default function ExceptionRouter() {
  const { id } = useParams();
  const capturedIssue = readCapturedRouteIssues().find((item) => item.id === id);
  const routeIssue = capturedIssue || routeIntelligenceExceptions.find((item) => item.id === id);
  const ticketIssue = routeExceptionQueue.find((item) => item.id === id);

  if (routeIssue) {
    return <RouteIssueWorkflow issue={routeIssue} />;
  }

  return <TicketIssueDetail issue={ticketIssue || routeExceptionQueue[0]} />;
}
