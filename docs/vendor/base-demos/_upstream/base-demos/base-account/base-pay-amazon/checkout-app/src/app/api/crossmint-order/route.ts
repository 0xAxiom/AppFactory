import { NextRequest, NextResponse } from 'next/server';

interface OrderRequest {
  asin: string;
  price: number;
  title: string;
  userData: {
    email?: string;
    phone?: {
      number: string;
      countryCode: string;
    };
    address?: {
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      name: {
        firstName: string;
        familyName: string;
      };
    };
    name?: {
      firstName: string;
      lastName: string;
    };
  };
  payerAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderRequest = await request.json();

    console.log('Creating Crossmint order for:', orderData);

    // Validate required data
    if (!orderData.asin || !orderData.userData.address) {
      return NextResponse.json(
        { error: 'Missing required order information' },
        { status: 400 }
      );
    }

    // Extract user information
    const address = orderData.userData.address;
    const name = orderData.userData.name || address.name;

    // Prepare Crossmint order payload
    const crossmintPayload = {
      recipient: {
        email:
          orderData.userData.email ||
          `${name.firstName.toLowerCase()}@example.com`,
        physicalAddress: {
          name: `${name.firstName} ${name.lastName || address.name.familyName}`,
          line1: address.address1,
          line2: address.address2 || undefined,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
      },
      locale: 'en-US',
      payment: {
        receiptEmail:
          orderData.userData.email ||
          `${name.firstName.toLowerCase()}@example.com`,
        method: 'base-sepolia', // Use base-mainnet for production
        currency: 'usdc',
        payerAddress: orderData.payerAddress, // This is the same address that received the Base Pay payment
      },
      lineItems: [
        {
          productLocator: `amazon:${orderData.asin}`,
        },
      ],
    };

    console.log(
      'Crossmint payload:',
      JSON.stringify(crossmintPayload, null, 2)
    );

    // Make the actual Crossmint API call
    const baseUrl = process.env.NODE_ENV === 'production' ? 'www' : 'staging';
    const crossmintResponse = await fetch(
      `https://${baseUrl}.crossmint.com/api/2022-06-09/orders`,
      {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.CROSSMINT_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(crossmintPayload),
      }
    );

    if (!crossmintResponse.ok) {
      const errorData = await crossmintResponse.json();
      console.error('Crossmint API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create order with Crossmint', details: errorData },
        { status: 500 }
      );
    }

    const result = await crossmintResponse.json();

    console.log('Order created successfully:', result);

    // Now sign and submit the payment transaction
    if (
      result.order &&
      result.order.payment &&
      result.order.payment.preparation
    ) {
      console.log('Signing and submitting payment transaction...');

      const transactionPayload = {
        params: {
          calls: [
            {
              transaction:
                result.order.payment.preparation.serializedTransaction,
            },
          ],
          chain: 'base-sepolia', // Use "base" for production
        },
      };

      const transactionResponse = await fetch(
        `https://${baseUrl}.crossmint.com/api/2022-06-09/wallets/${orderData.payerAddress}/transactions`,
        {
          method: 'POST',
          headers: {
            'X-API-KEY': process.env.CROSSMINT_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionPayload),
        }
      );

      if (!transactionResponse.ok) {
        const transactionError = await transactionResponse.json();
        console.error('Transaction signing error:', transactionError);
        return NextResponse.json(
          {
            error: 'Order created but payment failed',
            details: transactionError,
            orderId: result.order.id,
          },
          { status: 500 }
        );
      }

      const transactionResult = await transactionResponse.json();
      console.log('Payment transaction successful:', transactionResult);

      return NextResponse.json({
        success: true,
        orderId: result.order.id || result.id,
        status: 'paid',
        message:
          'Your order has been placed and paid successfully! You will receive a confirmation email shortly.',
        orderResult: result,
        transactionResult: transactionResult,
      });
    } else {
      console.log('No payment preparation found in order result');
      return NextResponse.json({
        success: true,
        orderId: result.order?.id || result.id,
        status: result.order?.status || 'created',
        message:
          'Your order has been created but payment may need manual processing.',
        result: result,
      });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Crossmint order endpoint is ready',
    note: 'Set CROSSMINT_API_KEY environment variable to use real Crossmint API.',
  });
}
