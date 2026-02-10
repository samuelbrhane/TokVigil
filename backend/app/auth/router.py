from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.auth import get_api_key_auth, AuthenticatedRequest
from app.db.session import get_db
from app.core.auth import get_current_user
from app.auth.models import User
from app.auth import services
from app.auth.schemas import *
from app.core.exceptions import EmailAlreadyExistsError, InvalidPasswordError, BadRequestError, InvalidTokenError, UserNotFoundError
router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, request: Request, db: Session = Depends(get_db)):
    """Register a new user."""
    user = services.register_user(db, data, ip_address=request.client.host)
    if not user:
        raise EmailAlreadyExistsError()
    return user


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Login and get access + refresh tokens."""
    user = services.authenticate_user(db, data.email, data.password, ip_address=request.client.host)
    if not user:
        raise InvalidPasswordError(message="Invalid email or password")
    return TokenResponse(
        access_token=services.create_access_token(user.id),
        refresh_token=services.create_refresh_token(user.id)
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(data: TokenRefresh, db: Session = Depends(get_db)):
    """Get new access token using refresh token."""
    payload = services.decode_token(data.refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise InvalidTokenError(message="Invalid refresh token")
    
    user_id = int(payload.get("sub"))
    user = services.get_user_by_id(db, user_id)
    
    if not user:
        raise UserNotFoundError()
         
    
    return TokenResponse(
        access_token=services.create_access_token(user.id),
        refresh_token=services.create_refresh_token(user.id)
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile."""
    return services.update_user(db, current_user.id, data)


@router.post("/change-password", response_model=MessageResponse)
def change_password(
    data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change password for current user."""
    success = services.change_password(db, current_user.id, data.current_password, data.new_password)
    if not success:
        raise InvalidPasswordError(message="Current password is incorrect")

    return MessageResponse(message="Password changed successfully")


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    """Request password reset email."""
    services.request_password_reset(db, data.email)
    # Always return success to prevent email enumeration
    return MessageResponse(message="If the email exists, a reset link has been sent")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    """Reset password using token."""
    success = services.reset_password(db, data.token, data.new_password)
    if not success:
        raise InvalidTokenError(message="Invalid or expired reset token")
    return MessageResponse(message="Password reset successfully")


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(data: VerifyEmail, db: Session = Depends(get_db)):
    """Verify email using token."""
    success = services.verify_email(db, data.token)
    if not success:
        raise InvalidTokenError(message="Invalid or expired verification token")
        
    return MessageResponse(message="Email verified successfully")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Resend email verification."""
    services.send_verification_email(db, current_user.id)
    return MessageResponse(message="Verification email sent")


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete current user account (GDPR compliance)."""
    services.delete_user(db, current_user.id)
    return None


@router.get("/me/plan", response_model=UserPlanResponse)
def get_current_plan(current_user: User = Depends(get_current_user)):
    """Get current user's plan details."""
    from app.core.plans import get_plan
    plan_details = get_plan(current_user.plan)
    return UserPlanResponse(
        plan=current_user.plan,
        **plan_details
    )
    
    
@router.get("/api-key-info", response_model=ApiKeyInfoResponse)
def get_api_key_info(
    auth: AuthenticatedRequest = Depends(get_api_key_auth),
    db: Session = Depends(get_db)
):
    """Get information about the current API key. Requires X-API-Key header."""
    from app.workspaces.models import Workspace, Environment, ApiKey
    
    # Get workspace
    workspace = db.query(Workspace).filter(
        Workspace.id == auth.workspace_id,
        Workspace.is_deleted == False
    ).first()
    
    # Get environment
    environment = db.query(Environment).filter(
        Environment.id == auth.environment_id,
        Environment.is_deleted == False
    ).first()
    
    # Get API key details
    api_key = db.query(ApiKey).filter(
        ApiKey.id == auth.api_key_id
    ).first()
    
    return ApiKeyInfoResponse(
        key_prefix=api_key.key_prefix,
        name=api_key.name,
        environment_id=auth.environment_id,
        environment_name=environment.name if environment else "unknown",
        workspace_id=auth.workspace_id,
        workspace_name=workspace.name if workspace else "unknown"
    )