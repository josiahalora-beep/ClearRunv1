import React from "react";
import { useParams } from "react-router-dom";
import TicketIssueDetail from "@/pages/TicketIssueDetail";
import RouteExceptionDetail from "@/pages/RouteExceptionDetail";
import { routeExceptionQueue } from "@/data/mockData";
import { routeIntelligenceExceptions } from "@/data/routeIntelligenceData";

export default function ExceptionRouter() {
  const { id } = useParams();
  const routeIssue = routeIntelligenceExceptions.find((item) => item.id === id);
  const ticketIssue = routeExceptionQueue.find((item) => item.id === id);

  if (routeIssue) {
    return <RouteExceptionDetail exception={routeIssue} />;
  }

  return <TicketIssueDetail issue={ticketIssue || routeExceptionQueue[0]} />;
}
