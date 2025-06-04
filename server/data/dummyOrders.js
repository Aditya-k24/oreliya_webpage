export default [
  {
    _id: '1',
    user: 'u1',
    items: [
      { productId: 'p101', name: 'Modern Necklace', quantity: 1 },
      { productId: 'p102', name: 'Modern Bracelet', quantity: 2 }
    ],
    shippingAddress: '123 Fashion Ave',
    totalAmount: 250,
    paymentStatus: 'Paid',
    orderStatus: 'Pending'
  },
  {
    _id: '2',
    user: 'u2',
    items: [
      { productId: 'p103', name: 'Modern Ring', quantity: 1 }
    ],
    shippingAddress: '456 Style Rd',
    totalAmount: 120,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped'
  }
];
