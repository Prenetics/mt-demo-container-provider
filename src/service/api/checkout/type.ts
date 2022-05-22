export type PaymentKey = {
    publishableKey: string;
};

export type PaymentGateway = {
    paymentId: string;
    paymentKey: PaymentKey;
};

export type OrderDetails = {
    orderNo: string;
    email: string;
};
