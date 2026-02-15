from app.core.config import settings
from app.notifications.email import send_postmark_email  # your file

async def send_verification_email(to_email: str, token: str):
    verify_url = f"{settings.frontend_url}/verify-email?token={token}"

    subject = "Verify your TokVigil email"
    text = f"Verify your email: {verify_url}"

    html = f"""
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 12px 0;">Verify your email</h2>
      <p>Thanks for signing up for TokVigil.</p>
      <p>
        <a href="{verify_url}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#6d28d9;color:#fff;text-decoration:none;">
          Verify email
        </a>
      </p>
      <p style="color:#666;font-size:13px">If the button doesn’t work, open this link:</p>
      <p><a href="{verify_url}">{verify_url}</a></p>
    </div>
    """

    await send_postmark_email(to=to_email, subject=subject, html=html, text=text)


async def send_password_reset_email(to_email: str, token: str):
    reset_url = f"{settings.frontend_url}/reset-password?token={token}"

    subject = "Reset your TokVigil password"
    text = f"Reset your password: {reset_url}"

    html = f"""
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 12px 0;">Reset your password</h2>
      <p>Click below to reset your password:</p>
      <p>
        <a href="{reset_url}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#6d28d9;color:#fff;text-decoration:none;">
          Reset password
        </a>
      </p>
      <p style="color:#666;font-size:13px">If the button doesn’t work, open this link:</p>
      <p><a href="{reset_url}">{reset_url}</a></p>
      <p style="color:#666;font-size:13px">If you didn’t request this, you can ignore this email.</p>
    </div>
    """

    await send_postmark_email(to=to_email, subject=subject, html=html, text=text)
