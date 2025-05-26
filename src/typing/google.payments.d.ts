declare namespace google {
    namespace payments {
      namespace api {
        interface PaymentDataRequest {
          apiVersion: number;
          apiVersionMinor: number;
          allowedPaymentMethods: any[];
          merchantInfo: {
            merchantName: string;
            merchantId?: string;
          };
          transactionInfo: {
            totalPriceStatus: string;
            totalPrice: string;
            currencyCode: string;
          };
        }
      }
    }
  }