export type TPaymentBody = {
  price: number,
  email: string,
  agreement: boolean,
  church: string,
  city: string,
  firstName: string,
  lastName: string,
  phone: string,
  eventType: string,
};

export type TDonationBody = {
  price: number,
};

export type TPaymentStatus = {
  event: 'payment.succeeded' | 'payment.waiting_for_capture' | 'payment.canceled' | 'refund.succeeded',
  type: string,
  object: TPaymentObject
}

export type TPaymentObject = {
  id: string,
  status: string
  amount: { value: string, currency: string },
  description: string,
  recipient: { account_id: string, gateway_id: string },
  payment_method: {
    type: string,
    id: string,
    card: object
  },
  created_at: string,
  expires_at: string,
  metadata: TPaymentMetadata,
}

export type TPaymentMetadata = {
  email?: string, 
  firstName?: string, 
  lastName?: string,
  value?: string,
  phone?: string,
  church?: string,
  city?: string,
  isDonation: string,
  eventType: 'юсурал' | 'бизнес',
}