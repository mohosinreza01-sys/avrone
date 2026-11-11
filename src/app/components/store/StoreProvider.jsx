"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { products } from "@/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const CART_KEY = "avrone-cart-v1";
const WISHLIST_KEY = "avrone-wishlist-v1";
const ORDERS_KEY = "avrone-orders-v1";
const CATALOG_KEY = "avrone-catalog-v1";
const emptySnapshot = { cart: [], wishlist: [], orders: [], catalog: products, catalogLoaded: false };
let snapshot = emptySnapshot;
let initialized = false;
const listeners = new Set();

function readStoredArray(key, isValid) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) {
      throw new Error(`Stored value for ${key} is not a list.`);
    }
    return value.filter(isValid);
  } catch (error) {
    console.error(`Could not restore ${key} from this browser.`, error);
    return [];
  }
}

function loadSnapshot() {
  if (typeof window === "undefined" || initialized) return snapshot;

  const savedCatalog = readStoredArray(
    CATALOG_KEY,
    (product) =>
      product &&
      typeof product.id === "string" &&
      typeof product.name === "string" &&
      Array.isArray(product.sizes),
  );
  snapshot = {
    cart: readStoredArray(
      CART_KEY,
      (item) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.size === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    ),
    wishlist: readStoredArray(
      WISHLIST_KEY,
      (id) => typeof id === "string",
    ),
    orders: readStoredArray(
      ORDERS_KEY,
      (order) =>
        order &&
        typeof order.id === "string" &&
        order.customer &&
        Array.isArray(order.items) &&
        Number.isFinite(order.total),
    ),
    catalog: savedCatalog,
    catalogLoaded: savedCatalog.length > 0,
  };
  if (!snapshot.catalog.length) snapshot.catalog = products;
  initialized = true;
  return snapshot;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function onStorageChange(event) {
  if (event.key && ![CART_KEY, WISHLIST_KEY, ORDERS_KEY].includes(event.key)) return;
  initialized = false;
  loadSnapshot();
  notify();
}

function subscribe(listener) {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", onStorageChange);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorageChange);
    }
  };
}

function getSnapshot() {
  return loadSnapshot();
}

function getServerSnapshot() {
  return emptySnapshot;
}

function updateSnapshot(update) {
  const next = update(loadSnapshot());
  if (next === snapshot) return;
  snapshot = next;
  initialized = true;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(snapshot.cart));
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(snapshot.wishlist));
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(snapshot.orders));
  } catch (error) {
    console.error("Could not save AVRONE store data in this browser.", error);
  }
  notify();
}

function addToCart(productId, size, quantity = 1) {
  const product = loadSnapshot().catalog.find((item) => item.id === productId);
  if (!product || !product.sizes.includes(size) || !Number.isInteger(quantity) || quantity < 1) {
    console.error("Cannot add an invalid product, size, or quantity to the cart.");
    return;
  }

  updateSnapshot((current) => {
    const existing = current.cart.find(
      (item) => item.productId === productId && item.size === size,
    );
    const cart = existing
      ? current.cart.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [...current.cart, { productId, size, quantity }];
    return { ...current, cart };
  });
}

function setQuantity(productId, size, quantity) {
  if (!Number.isInteger(quantity) || quantity < 0) return;
  updateSnapshot((current) => ({
    ...current,
    cart: quantity === 0
      ? current.cart.filter((item) => !(item.productId === productId && item.size === size))
      : current.cart.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item,
        ),
  }));
}

function removeFromCart(productId, size) {
  updateSnapshot((current) => ({
    ...current,
    cart: current.cart.filter((item) => !(item.productId === productId && item.size === size)),
  }));
}

function toggleWishlist(productId) {
  if (!loadSnapshot().catalog.some((product) => product.id === productId)) return;
  updateSnapshot((current) => ({
    ...current,
    wishlist: current.wishlist.includes(productId)
      ? current.wishlist.filter((id) => id !== productId)
      : [...current.wishlist, productId],
  }));
}

export function StoreProvider({ children }) {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const controller = new AbortController();
    fetch("/api/products", { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load catalog data.");
        if (!Array.isArray(data.products)) throw new Error("The catalog response is invalid.");
        snapshot = { ...loadSnapshot(), catalog: data.products, catalogLoaded: true };
        initialized = true;
        try {
          window.localStorage.setItem(CATALOG_KEY, JSON.stringify(data.products));
        } catch (error) {
          console.error("Could not cache the latest catalog in this browser.", error);
        }
        notify();
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Could not refresh the product catalog.", error);
        }
      });

    return () => controller.abort();
  }, []);

  return children;
}

export function useStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const cartItems = useMemo(
    () =>
      state.cart.flatMap((item) => {
        const product = state.catalog.find((entry) => entry.id === item.productId);
        return product ? [{ ...item, product }] : [];
      }),
    [state.cart, state.catalog],
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return {
    cartItems,
    cartCount,
    subtotal,
    wishlist: state.wishlist,
    orders: state.orders,
    catalog: state.catalog,
    catalogLoaded: state.catalogLoaded,
    ready: initialized,
    addToCart,
    setQuantity,
    removeFromCart,
    toggleWishlist,
    clearCart: () => updateSnapshot((current) => ({ ...current, cart: [] })),
  };
}
