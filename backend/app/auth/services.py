from datetime import datetime, timedelta
from typing import Optional
import secrets
import hashlib

from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.core.config import settings
from app.auth.models import User
from app.auth.schemas import UserRegister, UserUpdate
from app.audit.services import create_audit_log
from app.core.exceptions import EmailNotVerifiedError
from app.auth.models import ContactMessage


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}${hashed.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt, stored_hash = hashed_password.split('$')
        new_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt.encode(), 100000)
        return new_hash.hex() == stored_hash
    except:
        return False


def create_access_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "type": "access"
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "type": "refresh"
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None


def register_user(db: Session, data: UserRegister, ip_address: str = None) -> Optional[User]:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        return None
    
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        email_verification_token=secrets.token_urlsafe(32)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    create_audit_log(
        db=db,
        action="REGISTERED",
        resource_type="USER",
        user_id=user.id,
        user_email=user.email,
        resource_id=user.id,
        resource_name=user.email,
        ip_address=ip_address
    )
    
    # TODO: Send verification email
    print(f"\n{'='*50}")
    print(f"EMAIL VERIFICATION TOKEN for {user.email}")
    print(f"Token: {user.email_verification_token}")
    print(f"{'='*50}\n")
    
    return user
    


def authenticate_user(db: Session, email: str, password: str, ip_address: str = None) -> Optional[User]:
    user = db.query(User).filter(
        User.email == email,
        User.is_active == True,
        User.is_deleted == False
    ).first()
    
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        create_audit_log(
            db=db,
            action="LOGIN_FAILED",
            resource_type="USER",
            user_email=email,
            ip_address=ip_address
        )
        return None
    
    if not user.email_verified:
        raise EmailNotVerifiedError()  # new exception
    
    create_audit_log(
        db=db,
        action="LOGGED_IN",
        resource_type="USER",
        user_id=user.id,
        user_email=user.email,
        resource_id=user.id,
        resource_name=user.email,
        ip_address=ip_address
    )
    
    return user

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(
        User.id == user_id,
        User.is_active == True,
        User.is_deleted == False
    ).first()


def update_user(db: Session, user_id: int, data: UserUpdate) -> User:
    user = get_user_by_id(db, user_id)
    
    old_values = {"first_name": user.first_name, "last_name": user.last_name}
    
    if data.first_name is not None:
        user.first_name = data.first_name
    if data.last_name is not None:
        user.last_name = data.last_name
    
    db.commit()
    db.refresh(user)
    
    create_audit_log(
        db=db,
        action="UPDATED",
        resource_type="USER",
        user_id=user_id,
        user_email=user.email,
        resource_id=user_id,
        resource_name=user.email,
        old_values=old_values,
        new_values=data.model_dump(exclude_unset=True)
    )
    
    return user


def change_password(db: Session, user_id: int, current_password: str, new_password: str) -> bool:
    user = get_user_by_id(db, user_id)
    
    if not verify_password(current_password, user.password_hash):
        return False
    
    user.password_hash = hash_password(new_password)
    db.commit()
    
    create_audit_log(
        db=db,
        action="CHANGED_PASSWORD",
        resource_type="USER",
        user_id=user_id,
        user_email=user.email,
        resource_id=user_id,
        resource_name=user.email
    )
    
    return True


def request_password_reset(db: Session, email: str) -> bool:
    user = db.query(User).filter(
        User.email == email,
        User.is_active == True,
        User.is_deleted == False
    ).first()
    
    if not user:
        return False
    
    user.password_reset_token = secrets.token_urlsafe(32)
    user.password_reset_expires = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    
    create_audit_log(
        db=db,
        action="REQUESTED_PASSWORD_RESET",
        resource_type="USER",
        user_id=user.id,
        user_email=user.email,
        resource_id=user.id,
        resource_name=user.email
    )
    
    # TODO: Send password reset email
    print(f"\n{'='*50}")
    print(f"PASSWORD RESET TOKEN for {user.email}")
    print(f"Token: {user.password_reset_token}")
    print(f"{'='*50}\n")
    
    return True



def reset_password(db: Session, token: str, new_password: str) -> bool:
    user = db.query(User).filter(
        User.password_reset_token == token,
        User.password_reset_expires > datetime.utcnow(),
        User.is_active == True,
        User.is_deleted == False
    ).first()
    
    if not user:
        return False
    
    user.password_hash = hash_password(new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.commit()
    
    create_audit_log(
        db=db,
        action="RESET_PASSWORD",
        resource_type="USER",
        user_id=user.id,
        user_email=user.email,
        resource_id=user.id,
        resource_name=user.email
    )
    
    return True


def verify_email(db: Session, token: str) -> bool:
    user = db.query(User).filter(
        User.email_verification_token == token,
        User.is_active == True,
        User.is_deleted == False
    ).first()
    
    if not user:
        return False
    
    user.email_verified = True
    user.email_verification_token = None
    db.commit()
    
    create_audit_log(
        db=db,
        action="VERIFIED_EMAIL",
        resource_type="USER",
        user_id=user.id,
        user_email=user.email,
        resource_id=user.id,
        resource_name=user.email
    )
    
    return True


def send_verification_email(db: Session, user_id: int) -> bool:
    user = get_user_by_id(db, user_id)
    
    if user.email_verified:
        return False
    
    user.email_verification_token = secrets.token_urlsafe(32)
    db.commit()
    
    # TODO: Send verification email
    
    return True


def delete_user(db: Session, user_id: int) -> bool:
    user = get_user_by_id(db, user_id)
    
    if not user:
        return False
    
    user_email = user.email
    user.is_deleted = True
    user.deleted_at = datetime.utcnow()
    user.email = f"deleted_{user.id}_{user.email}"  
    db.commit()
    
    create_audit_log(
        db=db,
        action="DELETED",
        resource_type="USER",
        user_id=user_id,
        user_email=user_email,
        resource_id=user_id,
        resource_name=user_email
    )
    
    return True



def create_contact_message(db: Session, data: dict) -> ContactMessage:
    message = ContactMessage(
        name=data["name"],
        email=data["email"],
        subject=data["subject"],
        message=data["message"],
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message