import { NextRequest, NextResponse } from 'next/server';

interface BasePayCallback {
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
}

export async function POST(request: NextRequest) {
  try {
    const data: BasePayCallback = await request.json();
    
    console.log('Received Base Pay callback data:', data);
    
    // Store user data temporarily (in production, use a proper database or session)
    // For now, we'll send it back to the client via a redirect or message
    
    // Validate the data
    if (!data.address || !data.address.address1 || !data.address.city) {
      return NextResponse.json(
        { error: 'Address information is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you'd store this data and redirect the user
    // For this demo, we'll use localStorage and postMessage to communicate with the parent window
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Base Pay Callback</title>
        </head>
        <body>
          <script>
            const userData = ${JSON.stringify(data)};
            
            // Store data in localStorage for the checkout page to access
            localStorage.setItem('basePay_userData', JSON.stringify(userData));
            
            // Try to communicate with parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'BASE_PAY_SUCCESS',
                userData: userData
              }, window.location.origin);
              window.close();
            } else {
              // Redirect back to checkout with success flag
              window.location.href = '/checkout?payment_success=true';
            }
          </script>
          <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
            <h2>Payment Information Received</h2>
            <p>Redirecting you back to complete your order...</p>
          </div>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Invalid callback data' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Base Pay callback endpoint is ready' });
}