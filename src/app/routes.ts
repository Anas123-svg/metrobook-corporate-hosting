import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage";
import { BookingsPage } from "./pages/BookingsPage/BookingsPage";
import { NewBookingPage } from "./pages/NewBookingPage/NewBookingPage";
import { PropertiesPage } from "./pages/PropertiesPage/PropertiesPage";
import { CustomersPage } from "./pages/CustomersPage/CustomersPage";
import { ReportingPage } from "./pages/ReportingPage/ReportingPage";
import { InvoicesPage } from "./pages/InvoicesPage/InvoicesPage";
import { BookingAlertsPage } from "./pages/BookingAlertPage/BookingAlertsPage";
import { ProgramsPage } from "./pages/ProgramsPage/ProgramsPage";
import { PeoplePage } from "./pages/PeoplePage/PeoplePage";
import { PendingActionsPage } from "./pages/PendingActionsPage/PendingActionsPage";
import { VerificationPage } from "./pages/VerificationPage/VerificationPage";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";
import { WalletPage } from "./pages/WalletPage/WalletPage";
import { AddCustomerPage } from "./pages/CustomersPage/add/AddCustomerPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "bookings", Component: BookingsPage },
      { path: "new-booking", Component: NewBookingPage },
      { path: "properties", Component: PropertiesPage },
      { path: "customers", Component: CustomersPage },
      { path: "reporting", Component: ReportingPage },
      { path: "invoices", Component: InvoicesPage },
      { path: "wallet", Component: WalletPage },
      { path: "alerts", Component: BookingAlertsPage },
      { path: "programs", Component: ProgramsPage },
      { path: "people", Component: PeoplePage },
      { path: "pending-actions", Component: PendingActionsPage },
      { path: "verification", Component: VerificationPage },
      { path: "settings", Component: SettingsPage },
      {path:"customers/add", Component: AddCustomerPage},
    ],
  },
]);
