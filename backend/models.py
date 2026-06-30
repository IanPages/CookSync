import uuid
import logging
from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime, text, Numeric, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

##Logger for better error tracking into the CLI
logger = logging.getLogger("cooksync.models")

#Core Tables
class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False,unique=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    google_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, unique=True)
    picture: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=text("TIMEZONE('utc',NOW())"))

    home_associations: Mapped[List["HomeMember"]] = relationship(back_populates="user",cascade="all, delete-orphan")
    messages: Mapped[List["ChatMessage"]] = relationship(back_populates="user")

class Home(Base):
    __tablename__ = "homes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    invite_code: Mapped[str] = mapped_column(String(10), unique=True, index=True,nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=text("TIMEZONE('utc', NOW())"))
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    member_associations: Mapped[List["HomeMember"]] = relationship(back_populates="home", cascade="all, delete-orphan")
    recipes: Mapped[List["Recipe"]] = relationship(back_populates="home", cascade="all, delete-orphan")
    shopping_items: Mapped[List["ShoppingListItem"]] = relationship(back_populates="home", cascade="all, delete-orphan")
    recipe_history: Mapped[List["HomeRecipeHistory"]] = relationship(back_populates="home", cascade="all, delete-orphan")
    messages: Mapped[List["ChatMessage"]] = relationship(back_populates="home", cascade="all, delete-orphan")

class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    home_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("homes.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    source_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=text("TIMEZONE('utc', NOW())"))

    home: Mapped["Home"] = relationship(back_populates="recipes")
    ingredient_associations: Mapped[List["RecipeIngredient"]] = relationship(back_populates="recipe", cascade="all, delete-orphan")
    history_entries: Mapped[List["HomeRecipeHistory"]] = relationship(back_populates="recipe", cascade="all, delete-orphan")

class Ingredient(Base):
    __tablename__= "ingredients"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key= True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    default_unit: Mapped[str] = mapped_column(String(20), nullable=False)

    recipe_associations: Mapped[List["RecipeIngredient"]] = relationship(back_populates="ingredient")
    shopping_items: Mapped[List["ShoppingListItem"]] = relationship(back_populates="ingredient")

# Functionality Tables

class ShoppingListItem(Base):
    __tablename__ = "shopping_list_items"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True,default=uuid.uuid4)
    home_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("homes.id",ondelete="CASCADE"),nullable=False, index=True)
    ingredient_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("ingredients.id", ondelete="RESTRICT"), nullable=False)
    quantity: Mapped[float] =mapped_column(Numeric(10,2), nullable=False, server_default="0.00")
    unit: Mapped[str] = mapped_column(String(10),nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    is_purchased: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=text("TIMEZONE('utc', NOW())"))

    home: Mapped["Home"] = relationship(back_populates="shopping_items")
    ingredient: Mapped["Ingredient"] = relationship(back_populates="shopping_items")

class HomeRecipeHistory(Base):
    __tablename__ = "home_recipe_history"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    home_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("homes.id", ondelete="CASCADE"), nullable=False, index=True)
    recipe_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    cooked_at: Mapped[datetime] = mapped_column(DateTime, server_default=text("TIMEZONE('utc', NOW())"))

    # Relaciones
    home: Mapped["Home"] = relationship(back_populates="recipe_history")
    recipe: Mapped["Recipe"] = relationship(back_populates="history_entries")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    home_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("homes.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_ai_message: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    timestamp: Mapped[datetime] = mapped_column(DateTime, server_default=text("TIMEZONE('utc', NOW())"))

    # Relaciones
    home: Mapped["Home"] = relationship(back_populates="messages")
    user: Mapped[Optional["User"]] = relationship(back_populates="messages")

#Intemediate Tables N:M Relationship

class HomeMember(Base):
    __tablename__ = "homeMembers"

    home_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("homes.id", ondelete="CASCADE"),primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id",ondelete="CASCADE"),primary_key=True)
    role: Mapped[str] = mapped_column(String(10), server_default="member") #admin/member
    joined_at: Mapped[datetime] = mapped_column(DateTime, server_default=text("TIMEZONE('utc',NOW())"))

    home: Mapped["Home"] = relationship(back_populates="member_associations")
    user: Mapped["User"] = relationship(back_populates="home_associations")

class RecipeIngredient(Base):
    __tablename__ = "recipeIngredients"

    recipe_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"),primary_key=True)
    ingredient_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("ingredients.id",ondelete="CASCADE"),primary_key=True)
    quantity: Mapped[float] = mapped_column(Numeric(10,2),nullable=False)
    unit: Mapped[str] = mapped_column(String(10), nullable=False)

    recipe: Mapped["Recipe"] = relationship(back_populates="ingredient_associations")
    ingredient: Mapped["Ingredient"]= relationship(back_populates="recipe_associations")
