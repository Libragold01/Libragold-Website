// Lotus Bank Payment Service
export interface PaymentRequest {
  amount: number;
  currency: string;
  email: string;
  reference: string;
  callback_url?: string;
  metadata?: any;
  paymentMethod?: 'card' | 'transfer';
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardName: string;
  };
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

class LotusPaymentService {
  private baseURL = 'https://partnerhub.lotusbank.com/api/v1';
  private publicKey = 'live_365d8dfe2c2c0c6dcde08ceb861a45f025dbe44276deac4fa13d6378698eab6f8ffa6911be5365b48691f6e663040c99pb';
  private secretKey = 'live_e7936616ef34e6f2dccb99098835b68d5addc8bdcb410f2c168f0253e59681568c64ece5d2d766fedef2b65cdb4417bf1761341058425sk';
  private webhookUrl = window.location.origin + '/api/webhook/lotus';

  async initializePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const endpoint = `${this.baseURL}/checkout/initialize`;

      console.log('Lotus API call:', { endpoint, amount: paymentData.amount, currency: paymentData.currency });

      // Amount in Naira (Lotus Bank expects amount in Naira, not kobo)
      const amount = Math.round(paymentData.amount);

      const payload = {
        walletId: 'master',
        amount: amount,
        currency: paymentData.currency || 'NGN'
      };

      console.log('Payment payload:', payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': this.publicKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('API Response:', result);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok || !result.success) {
        console.error('Payment API error:', result);
        console.error('Full error details:', JSON.stringify(result, null, 2));
        return {
          status: false,
          message: result.message || result.error || `API Error (${response.status}): Payment initialization failed. Please try again.`,
        };
      }

      return {
        status: result.success,
        message: result.message,
        data: {
          authorization_url: result.data.authorization_url,
          access_code: result.data.reference,
          reference: result.data.reference
        }
      };
    } catch (error: any) {
      console.error('Lotus API Error:', error);
      // Check if it's a CORS or network error
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        return {
          status: false,
          message: 'Network error. Please check your connection and try again.',
        };
      }
      return {
        status: false,
        message: error.message || 'Payment processing failed. Please try again.',
      };
    }
  }

  async verifyPayment(reference: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseURL}/payment/verify/${reference}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.secretKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return {
        status: false,
        message: 'Payment verification failed.',
      };
    }
  }

  generateReference(): string {
    return `LBG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/banks`, {
        method: 'GET',
        headers: {
          'x-api-key': this.secretKey,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Simulate card payment
  async simulateCardPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: 'Card payment successful (simulated)',
          data: {
            authorization_url: '#',
            access_code: 'test_card_' + Date.now(),
            reference: paymentData.reference,
          },
        });
      }, 2000);
    });
  }

  // Simulate bank transfer
  async simulateBankTransfer(paymentData: PaymentRequest): Promise<PaymentResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: 'Bank transfer details generated (simulated)',
          data: {
            authorization_url: '#',
            access_code: 'test_transfer_' + Date.now(),
            reference: paymentData.reference,
          },
        });
      }, 1500);
    });
  }
}

export const lotusPayment = new LotusPaymentService();

// Export processPayment function for components
export const processPayment = async (paymentData: any) => {
  return await lotusPayment.initializePayment({
    amount: paymentData.amount,
    currency: paymentData.currency || 'NGN',
    email: paymentData.customer.email,
    reference: paymentData.reference,
    metadata: paymentData.metadata,
    paymentMethod: paymentData.paymentMethod,
    cardDetails: paymentData.cardDetails
  });
};