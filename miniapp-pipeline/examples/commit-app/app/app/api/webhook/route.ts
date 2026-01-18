/**
 * Webhook Handler for Commit App
 * Handles Farcaster notification events
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { header, payload } = body;

    // Decode the event
    const headerData = JSON.parse(Buffer.from(header, 'base64url').toString());
    const event = JSON.parse(Buffer.from(payload, 'base64url').toString());

    console.log('Webhook event:', event.event, 'from FID:', headerData.fid);

    // Handle different event types
    switch (event.event) {
      case 'frame_added':
        // User added the app - could send welcome notification
        console.log('User added Commit app');
        break;

      case 'frame_removed':
        // User removed the app
        console.log('User removed Commit app');
        break;

      case 'notifications_enabled':
        // User enabled notifications
        console.log('Notifications enabled');
        break;

      case 'notifications_disabled':
        // User disabled notifications
        console.log('Notifications disabled');
        break;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ success: false }, { status: 500 });
  }
}
