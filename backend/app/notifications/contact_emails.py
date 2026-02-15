from app.notifications.email import send_postmark_email

async def send_contact_notification(name: str, email: str, subject: str, message: str):
    html = f"""
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2>New Contact Form Submission</h2>

      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Subject:</strong> {subject}</p>

      <hr style="margin:16px 0">

      <p style="white-space:pre-line">{message}</p>

      <hr style="margin:16px 0">

      <p style="color:#666;font-size:13px">
        Reply directly to this email to respond to the user.
      </p>
    </div>
    """

    text = f"""
New Contact Form Submission

Name: {name}
Email: {email}
Subject: {subject}

{message}
"""

    await send_postmark_email(
        to="support@tokvigil.com",
        subject=f"[TokVigil Contact] {subject}",
        html=html,
        text=text,
        reply_to=email  
    )
