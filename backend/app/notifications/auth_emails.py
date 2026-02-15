from app.core.config import settings
from app.notifications.email import send_postmark_email

BRAND_HEX = "#22D3EE"  


APP_NAME = "TokVigil"
SUPPORT_EMAIL = getattr(settings, "support_email", "support@tokvigil.com")
SECURITY_FOOTER = (
    f"This email was sent by {APP_NAME}. "
    "If you believe this was sent to you in error, you can safely ignore it."
)

def _base_email_html(title: str, intro: str, cta_label: str, url: str, extra: str = "") -> str:
    return f"""
    <div style="background:#0b0f19;padding:24px 12px;">
      <div style="max-width:560px;margin:0 auto;font-family:Arial,sans-serif;line-height:1.5;color:#111;">
        <div style="padding:18px 20px;color:#002a30;">
          <div style="font-weight:700;letter-spacing:0.2px;font-size:16px;">{APP_NAME}</div>
        </div>

        <div style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid rgba(0,0,0,0.06);">
          <div style="padding:22px 22px 10px 22px;">
            <h2 style="margin:0 0 10px 0;font-size:20px;line-height:1.25;">{title}</h2>
            <p style="margin:0 0 14px 0;color:#333;">{intro}</p>

            <div style="margin:18px 0;">
              <a href="{url}"
                style="display:inline-block;padding:12px 16px;border-radius:12px;background:{BRAND_HEX};color:#002a30;text-decoration:none;font-weight:700;">
                    {cta_label} →
                </a>

            </div>

            <p style="margin:14px 0 6px 0;color:#555;font-size:13px;">
              If the button doesn’t work, copy and paste this link into your browser:
            </p>
            <p style="margin:0 0 10px 0;font-size:13px;word-break:break-all;">
              <a href="{url}" style="color:{BRAND_HEX};text-decoration:underline;">{url}</a>
            </p>

            {extra}
          </div>

          <div style="padding:14px 22px;background:#fafafa;border-top:1px solid rgba(0,0,0,0.06);">
            <p style="margin:0;color:#666;font-size:12px;">
              Need help? Contact us at
              <a href="mailto:{SUPPORT_EMAIL}" style="color:{BRAND_HEX};text-decoration:underline;">{SUPPORT_EMAIL}</a>.
            </p>
          </div>
        </div>

        <div style="padding:14px 6px 0 6px;">
          <p style="margin:0;color:rgba(255,255,255,0.65);font-size:12px;">
            {SECURITY_FOOTER}
          </p>
        </div>
      </div>
    </div>
    """

def _base_email_text(title: str, intro: str, action_line: str, url: str, extra: str = "") -> str:
    return (
        f"{APP_NAME}\n"
        f"{title}\n\n"
        f"{intro}\n\n"
        f"{action_line}\n"
        f"{url}\n\n"
        "If the link above doesn't work, copy and paste it into your browser.\n\n"
        f"{extra}\n"
        f"Need help? Email us at: {SUPPORT_EMAIL}\n\n"
        f"{SECURITY_FOOTER}\n"
    ).strip()


async def send_verification_email(to_email: str, token: str):
    verify_url = f"{settings.frontend_url}/verify-email/confirm?token={token}"

    subject = f"Verify your {APP_NAME} email"

    intro = (
        f"Thanks for signing up for {APP_NAME}. "
        "To finish setting up your account, please verify your email address."
    )

    extra_html = """
      <p style="margin:10px 0 0 0;color:#666;font-size:13px;">
        If you didn’t create an account, you can ignore this email. No changes will be made.
      </p>
      <p style="margin:10px 0 0 0;color:#666;font-size:13px;">
        For security, do not share this link with anyone.
      </p>
    """

    html = _base_email_html(
        title="Verify your email",
        intro=intro,
        cta_label="Verify email",
        url=verify_url,
        extra=extra_html,
    )

    extra_text = (
        "If you didn’t create an account, you can ignore this email.\n"
        "For security, do not share this link with anyone."
    )

    text = _base_email_text(
        title="Verify your email",
        intro=intro,
        action_line="Verify your email using this link:",
        url=verify_url,
        extra=extra_text,
    )

    await send_postmark_email(to=to_email, subject=subject, html=html, text=text)


async def send_password_reset_email(to_email: str, token: str):
    reset_url = f"{settings.frontend_url}/reset-password?token={token}"

    subject = f"Reset your {APP_NAME} password"

    intro = (
        f"We received a request to reset the password for your {APP_NAME} account. "
        "Use the link below to choose a new password."
    )

    extra_html = """
      <p style="margin:10px 0 0 0;color:#666;font-size:13px;">
        If you didn’t request a password reset, you can ignore this email. Your password will not change.
      </p>
      <p style="margin:10px 0 0 0;color:#666;font-size:13px;">
        For your security, this reset link should only be used by you.
      </p>
    """

    html = _base_email_html(
        title="Reset your password",
        intro=intro,
        cta_label="Reset password",
        url=reset_url,
        extra=extra_html,
    )

    extra_text = (
        "If you didn’t request a password reset, you can ignore this email.\n"
        "For your security, do not share this link with anyone."
    )

    text = _base_email_text(
        title="Reset your password",
        intro=intro,
        action_line="Reset your password using this link:",
        url=reset_url,
        extra=extra_text,
    )

    await send_postmark_email(to=to_email, subject=subject, html=html, text=text)
