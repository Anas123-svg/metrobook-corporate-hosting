export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = new Date(year, month, 1).getDay();
  return { daysInMonth, startDayOfWeek };
};

export const mockClients = [
  {
    id: 1,
    name: "John Johnson",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Ventures Inc",
    totalBookings: 12,
    totalListings: 3,
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    company: "Creative Studios",
    totalBookings: 8,
    totalListings: 2,
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 (555) 345-6789",
    company: "Global Trading Corp",
    totalBookings: 15,
    totalListings: 5,
  },
];
