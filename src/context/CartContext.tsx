"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SiteContent } from "@/lib/content/types";
import { computeProductPrice, getProductById } from "@/lib/data";
import { useSiteContent } from "@/context/ContentContext";

const STORAGE_KEY = "rushabh-cart";

type CartItem = {
  productId: number;
  quantity: number;
};

export type CartLine = CartItem & {
  name: string;
  price: number;
  metal: string;
  image: string;
  category: string;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        typeof item.productId === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function toCartLines(
  items: CartItem[],
  products: SiteContent["products"],
  store: SiteContent["store"],
): CartLine[] {
  return items
    .map((item) => {
      const product =
        products.find((entry) => entry.id === item.productId) ??
        getProductById(item.productId);
      if (!product) return null;
      return {
        ...item,
        name: product.name,
        price: computeProductPrice(product, store),
        metal: product.metal,
        image: product.image,
        category: product.category,
      };
    })
    .filter((line): line is CartLine => line !== null);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { content } = useSiteContent();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const lines = useMemo(
    () => toCartLines(items, content.products, content.store),
    [items, content.products, content.store],
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines],
  );

  const addToCart = useCallback((productId: number, quantity = 1) => {
    if (!getProductById(productId)) return;

    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, { productId, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      lines,
      itemCount,
      subtotal,
      isOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
