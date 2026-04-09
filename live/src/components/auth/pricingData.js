export const billingOptions = [
  { id: 1, label: "Monthly", discount: 0 },
  { id: 2, label: "Quarterly", discount: 0.15, badge: "-15%" },
  { id: 3, label: "Annual", discount: 0.25, badge: "-25%" },
];

export const plansData = {
  ultimate: [
    {
      id: 1,
      name: "Starter",
      price: 20,
      features: [
        { text: "Basic automation features", included: true },
        { text: "Email support", included: true },
        { text: "5 active bots", included: true },
        { text: "Advanced analytics", included: false },
      ],
    },
    {
      id: 2,
      name: "Pro",
      price: 40,
      isPopular: true,
      features: [
        { text: "Advanced automation", included: true },
        { text: "Priority support", included: true },
        { text: "20 active bots", included: true },
        { text: "Advanced analytics", included: true },
      ],
    },
    {
      id: 3,
      name: "Enterprise",
      price: 80,
      features: [
        { text: "Ultimate automation", included: true },
        { text: "24/7 dedicated support", included: true },
        { text: "Unlimited bots", included: true },
        { text: "Custom integrations", included: true },
      ],
    },
  ],
  precision: [
    {
      id: 4,
      name: "Basic",
      price: 15,
      features: [
        { text: "Core precision tools", included: true },
        { text: "Standard support", included: true },
        { text: "3 active projects", included: true },
        { text: "API access", included: false },
      ],
    },
    {
      id: 5,
      name: "Advanced",
      price: 30,
      isPopular: true,
      features: [
        { text: "Advanced precision tools", included: true },
        { text: "Priority support", included: true },
        { text: "10 active projects", included: true },
        { text: "API access", included: true },
      ],
    },
    {
      id: 6,
      name: "Elite",
      price: 60,
      features: [
        { text: "All precision features", included: true },
        { text: "VIP support", included: true },
        { text: "Unlimited projects", included: true },
        { text: "Custom workflows", included: true },
      ],
    },
  ],
};
