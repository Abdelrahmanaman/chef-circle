import { createFileRoute } from "@tanstack/react-router";
import LoginCard from "../../../components/auth/login-card";

export const Route = createFileRoute("/(auth)/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LoginCard />
    </div>
  );
}
