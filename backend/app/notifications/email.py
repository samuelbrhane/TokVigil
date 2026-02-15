import httpx
import logging
from app.core.config import settings

POSTMARK_SEND_URL = "https://api.postmarkapp.com/email"

logger = logging.getLogger("tokvigil.email")


async def send_postmark_email(
    to: str,
    subject: str,
    html: str,
    text: str,
    reply_to: str | None = None,
):
    if not settings.postmark_token:
        raise RuntimeError("POSTMARK_TOKEN is not set")

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": settings.postmark_token,
    }

    payload = {
        "From": f"TokVigil <{settings.mail_from}>",
        "To": to,
        "Subject": subject,
        "HtmlBody": html,
        "TextBody": text,
        "MessageStream": "outbound",
    }

    if reply_to:
        payload["ReplyTo"] = reply_to

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.post(POSTMARK_SEND_URL, headers=headers, json=payload)

            # 👇 Always log response body if not success
            if r.status_code >= 400:
                logger.error("POSTMARK FAILED")
                logger.error("Status: %s", r.status_code)
                logger.error("Body: %s", r.text)
                logger.error("Payload: %s", payload)

            r.raise_for_status()

    except Exception as e:
        logger.exception("POSTMARK EXCEPTION: %s", e)
        raise
