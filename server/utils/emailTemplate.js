export const bookingConfirmedEmail = ({
  userName,
  groundName,
  groundLocation,
  date,
  startTime,
  endTime,
  totalPrice,
  paymentStatusLabel,
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmed</title>
  </head>
  <body style="margin:0;padding:0;background:#1b0d0d;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#1b0d0d;margin:0;padding:30px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#0b0d12;border-radius:18px;overflow:hidden;">
            
            <tr>
              <td style="background:linear-gradient(135deg,#0c5c36,#1fa35b);padding:34px 24px;text-align:center;">
                <div style="font-size:36px;line-height:42px;font-weight:800;color:#ffffff;">
                  CricBook
                </div>
                <div style="font-size:17px;line-height:24px;color:#e8fff0;margin-top:8px;">
                  Booking Confirmed
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:34px 28px 30px;color:#ffffff;">
                <div style="font-size:18px;line-height:28px;margin-bottom:18px;">
                  Hi ${userName || "there"} 👋
                </div>

                <div style="font-size:18px;line-height:34px;color:#e7ebf0;margin-bottom:24px;">
                  Great news - your booking has been
                  <strong style="color:#ffffff;">confirmed.</strong>
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#1a1e24;border:1px solid #2d333d;border-radius:14px;margin-bottom:26px;">
                  <tr>
                    <td style="padding:22px 20px;color:#f4f6f8;font-size:16px;line-height:30px;">
                      <div><strong>Ground:</strong> ${groundName || "CricBook Ground"}</div>
                      <div><strong>Location:</strong> ${groundLocation || "N/A"}</div>
                      <div><strong>Date:</strong> ${date || "N/A"}</div>
                      <div><strong>Time:</strong> ${startTime || "N/A"} - ${endTime || "N/A"}</div>
                      <div><strong>Total Price:</strong> Rs. ${totalPrice ?? 0}</div>
                      <div><strong>Payment:</strong> ${paymentStatusLabel || "Pending"}</div>
                    </td>
                  </tr>
                </table>

                <div style="font-size:16px;line-height:32px;color:#d5dbe3;margin-bottom:20px;">
                  Please arrive a little early and keep this email for your reference.
                </div>

                <div style="font-size:16px;line-height:30px;color:#d5dbe3;">
                  Thanks for choosing <strong style="color:#ffffff;">CricBook</strong>. We hope you have a great game.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 22px;text-align:center;font-size:12px;color:#8e98a5;background:#11141a;">
                This is an automated email from CricBook.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const bookingDeclinedEmail = ({
  userName,
  groundName,
  groundLocation,
  date,
  startTime,
  endTime,
  totalPrice,
  paymentStatusLabel,
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Declined</title>
  </head>
  <body style="margin:0;padding:0;background:#1b0d0d;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#1b0d0d;margin:0;padding:30px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#0b0d12;border-radius:18px;overflow:hidden;">
            
            <tr>
              <td style="background:linear-gradient(135deg,#1f6b45,#2c8a57);padding:34px 24px;text-align:center;">
                <div style="font-size:36px;line-height:42px;font-weight:800;color:#ffffff;">
                  CricBook
                </div>
                <div style="font-size:17px;line-height:24px;color:#e8fff0;margin-top:8px;">
                  Booking Declined
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:34px 28px 30px;color:#ffffff;">
                <div style="font-size:18px;line-height:28px;margin-bottom:18px;">
                  Hi ${userName || "there"} 👋
                </div>

                <div style="font-size:18px;line-height:34px;color:#e7ebf0;margin-bottom:24px;">
                  We regret to inform you that your booking has been
                  <strong style="color:#ffffff;">declined.</strong>
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#1a1e24;border:1px solid #2d333d;border-radius:14px;margin-bottom:26px;">
                  <tr>
                    <td style="padding:22px 20px;color:#f4f6f8;font-size:16px;line-height:30px;">
                      <div><strong>Ground:</strong> ${groundName || "CricBook Ground"}</div>
                      <div><strong>Location:</strong> ${groundLocation || "N/A"}</div>
                      <div><strong>Date:</strong> ${date || "N/A"}</div>
                      <div><strong>Time:</strong> ${startTime || "N/A"} - ${endTime || "N/A"}</div>
                      <div><strong>Total Price:</strong> Rs. ${totalPrice ?? 0}</div>
                      <div><strong>Payment:</strong> ${paymentStatusLabel || "Pending"}</div>
                    </td>
                  </tr>
                </table>

                <div style="font-size:16px;line-height:32px;color:#d5dbe3;margin-bottom:20px;">
                  If you have any questions, please contact support.
                </div>

                <div style="font-size:16px;line-height:30px;color:#d5dbe3;">
                  Thanks for choosing <strong style="color:#ffffff;">CricBook</strong>. We hope to assist you with future bookings.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 22px;text-align:center;font-size:12px;color:#8e98a5;background:#11141a;">
                This is an automated email from CricBook.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const groundApprovedEmail = ({
  ownerName,
  groundName,
  location,
  pricePerHour,
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ground Approved</title>
  </head>
  <body style="margin:0;padding:0;background:#1b0d0d;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#1b0d0d;margin:0;padding:30px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#0b0d12;border-radius:18px;overflow:hidden;">
            
            <tr>
              <td style="background:linear-gradient(135deg,#0c5c36,#1fa35b);padding:34px 24px;text-align:center;">
                <div style="font-size:36px;line-height:42px;font-weight:800;color:#ffffff;">
                  CricBook
                </div>
                <div style="font-size:17px;line-height:24px;color:#e8fff0;margin-top:8px;">
                  Ground Approved
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:34px 28px 30px;color:#ffffff;">
                <div style="font-size:18px;line-height:28px;margin-bottom:18px;">
                  Hi ${ownerName || "Ground Owner"} 👋
                </div>

                <div style="font-size:18px;line-height:34px;color:#e7ebf0;margin-bottom:24px;">
                  Your ground has been
                  <strong style="color:#ffffff;">approved</strong>
                  and is now live on CricBook.
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#1a1e24;border:1px solid #2d333d;border-radius:14px;margin-bottom:26px;">
                  <tr>
                    <td style="padding:22px 20px;color:#f4f6f8;font-size:16px;line-height:30px;">
                      <div><strong>Ground:</strong> ${groundName || "N/A"}</div>
                      <div><strong>Location:</strong> ${location || "N/A"}</div>
                      <div><strong>Price per hour:</strong> Rs. ${pricePerHour ?? 0}</div>
                    </td>
                  </tr>
                </table>

                <div style="font-size:16px;line-height:32px;color:#d5dbe3;margin-bottom:20px;">
                  Users can now discover and request bookings for your ground through the platform.
                </div>

                <div style="font-size:16px;line-height:30px;color:#d5dbe3;">
                  Thank you for partnering with <strong style="color:#ffffff;">CricBook</strong>.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 22px;text-align:center;font-size:12px;color:#8e98a5;background:#11141a;">
                This is an automated email from CricBook.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const groundRejectedEmail = ({
  ownerName,
  groundName,
  location,
  rejectionReason,
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ground Rejected</title>
  </head>
  <body style="margin:0;padding:0;background:#1b0d0d;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#1b0d0d;margin:0;padding:30px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#0b0d12;border-radius:18px;overflow:hidden;">
            
            <tr>
              <td style="background:linear-gradient(135deg,#7a1f1f,#d43b3b);padding:34px 24px;text-align:center;">
                <div style="font-size:36px;line-height:42px;font-weight:800;color:#ffffff;">
                  CricBook
                </div>
                <div style="font-size:17px;line-height:24px;color:#fff1f1;margin-top:8px;">
                  Ground Rejected
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:34px 28px 30px;color:#ffffff;">
                <div style="font-size:18px;line-height:28px;margin-bottom:18px;">
                  Hi ${ownerName || "Ground Owner"} 👋
                </div>

                <div style="font-size:18px;line-height:34px;color:#e7ebf0;margin-bottom:24px;">
                  We reviewed your ground submission, but it was
                  <strong style="color:#ffffff;">not approved</strong>
                  at this time.
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#1a1e24;border:1px solid #2d333d;border-radius:14px;margin-bottom:26px;">
                  <tr>
                    <td style="padding:22px 20px;color:#f4f6f8;font-size:16px;line-height:30px;">
                      <div><strong>Ground:</strong> ${groundName || "N/A"}</div>
                      <div><strong>Location:</strong> ${location || "N/A"}</div>
                      <div><strong>Reason:</strong> ${
                        rejectionReason || "Please review your ground details and submit again."
                      }</div>
                    </td>
                  </tr>
                </table>

                <div style="font-size:16px;line-height:32px;color:#d5dbe3;margin-bottom:20px;">
                  You can update the ground details and resubmit it for approval.
                </div>

                <div style="font-size:16px;line-height:30px;color:#d5dbe3;">
                  Thank you for using <strong style="color:#ffffff;">CricBook</strong>.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 22px;text-align:center;font-size:12px;color:#8e98a5;background:#11141a;">
                This is an automated email from CricBook.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;