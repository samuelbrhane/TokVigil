from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.auth import services
from app.auth.schemas import *

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user."""
    user = services.register_user(db, data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return user


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Login and get access + refresh tokens."""
    user = services.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    return TokenResponse(
        access_token=services.create_access_token(user.id),
        refresh_token=services.create_refresh_token(user.id)
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(data: TokenRefresh, db: Session = Depends(get_db)):
    """Get new access token using refresh token."""
    payload = services.decode_token(data.refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = int(payload.get("sub"))
    user = services.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return TokenResponse(
        access_token=services.create_access_token(user.id),
        refresh_token=services.create_refresh_token(user.id)
    )