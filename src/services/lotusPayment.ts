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
  private publicKey = 'live_7a53461f576ef1c045c61db0918826882a7a3211c0703499a9d95286110cce43e877bf89c4081b0746fa50a0971e8cfapb';
  private secretKey = 'live_1d72abae39c0b5b81ed8bf3f6b0d4ef48118a27cda9a729de4e2e1a8cd2f087a2eba536d9b9175841ff0d7ae206f20141773007718614sk';
  async initializePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const endpoint = `${this.baseURL}/checkout/initialize`;

      // Amount in Naira (Lotus Bank expects amount in Naira, not kobo)
      const amount = Math.round(paymentData.amount);

      const payload = {
        walletId: 'master',
        amount: amount,
        currency: paymentData.currency || 'NGN'
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': this.publicKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
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
    } catch {
      return {
        status: false,
        message: 'Payment verification failed.',
      };
    }
  }

  generateReference(): string {
    // Use cryptographically secure random values instead of Math.random()
    return `LBG_${Date.now()}_${crypto.randomUUID().replace(/-/g, '').slice(0, 9)}`;
  }

  // Validate that a redirect URL is from the expected Lotus Bank domain
  // before redirecting the user — prevents open redirect attacks.
  isSafeRedirectUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.hostname.endsWith('lotusbank.com') || parsed.hostname.endsWith('paystack.com');
    } catch {
      return false;
    }
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