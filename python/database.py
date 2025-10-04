from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from typing import Generator, Optional

# --- Database Configuration ---
# For production, you would typically use PostgreSQL or MySQL.
# SQLite is used here for simplicity and quick setup.
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# Create the SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} # Needed for SQLite
)

# Create a SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our models
Base = declarative_base()

# --- SQLAlchemy User Model ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    wishlist_items = relationship("WishlistMovie", back_populates="user", cascade="all, delete-orphan")

    # Optional: Add a representation for debugging
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

# --- SQLAlchemy Wishlist Model ---
class WishlistMovie(Base):
    __tablename__ = "wishlist_movies"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="wishlist_items")

    def __repr__(self):
        return f"<WishlistMovie(user_id={self.user_id}, movie_id='{self.movie_id}')>"

# --- Database Utility Functions ---

def get_db() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Retrieves a user from the database by their email.
    """
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """
    Retrieves a user from the database by their username.
    """
    return db.query(User).filter(User.username == username).first()

def get_wishlist_for_user(db: Session, user_id: int) -> list[WishlistMovie]:
    """Retrieves all wishlist items for a specific user."""
    return db.query(WishlistMovie).filter(WishlistMovie.user_id == user_id).all()

def get_wishlist_item(db: Session, user_id: int, movie_id: int) -> Optional[WishlistMovie]:
    """Retrieves a specific wishlist item for a user and movie."""
    return db.query(WishlistMovie).filter(WishlistMovie.user_id == user_id, WishlistMovie.movie_id == movie_id).first()

def add_movie_to_wishlist(db: Session, user_id: int, movie_id: int) -> WishlistMovie:
    """Adds a movie to a user's wishlist."""
    db_wishlist_item = WishlistMovie(user_id=user_id, movie_id=movie_id)
    db.add(db_wishlist_item)
    db.commit()
    db.refresh(db_wishlist_item)
    return db_wishlist_item

def remove_movie_from_wishlist(db: Session, db_wishlist_item: WishlistMovie):
    """Removes a movie from a user's wishlist."""
    db.delete(db_wishlist_item)
    db.commit()

def create_db_tables():
    Base.metadata.create_all(bind=engine)