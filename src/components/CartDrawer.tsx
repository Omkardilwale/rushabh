"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { JewelryImage } from "@/components/JewelryImage";
import {
  buildCartEnquiryText,
  buildMailtoUrl,
  buildWhatsAppUrl,
} from "@/lib/cart-enquiry";
import { formatPrice } from "@/lib/data";
import { enquiryEmail } from "@/lib/contact";
import { siteConfig } from "@/lib/site-config";

export function CartDrawer() {
  const {
    lines,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const enquiryLines = lines.map((line) => ({
    name: line.name,
    metal: line.metal,
    quantity: line.quantity,
    price: line.price,
  }));
  const enquiryText = buildCartEnquiryText(enquiryLines, subtotal);
  const whatsappUrl = buildWhatsAppUrl(enquiryText);
  const mailtoUrl = buildMailtoUrl(
    `Jewellery enquiry from ${siteConfig.name}`,
    enquiryText,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[60] bg-maroon-dark/40"
            aria-label="Close enquiry list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-ivory shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label="Enquiry list"
          >
            <div className="flex items-center justify-between border-b border-gold/20 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-maroon" />
                <h2 className="font-serif text-xl text-maroon">Your Enquiries</h2>
                {itemCount > 0 && (
                  <span className="rounded-full bg-maroon px-2 py-0.5 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full p-2 text-maroon hover:bg-cream"
                aria-label="Close enquiry panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="h-12 w-12 text-gold/40" />
                <p className="mt-4 font-serif text-xl text-maroon">No enquiries yet</p>
                <p className="mt-2 text-sm text-foreground/60">
                  Tap Enquire on any piece, then send your list on WhatsApp or email.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-6 rounded-full gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-wider text-maroon-dark"
                >
                  Browse Shop
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {lines.map((line) => (
                    <li
                      key={line.productId}
                      className="flex gap-3 rounded-xl border border-gold/20 bg-white p-3"
                    >
                      <Link
                        href={`/shop/${line.productId}`}
                        onClick={closeCart}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream"
                      >
                        <JewelryImage
                          src={line.image}
                          alt={line.name}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/shop/${line.productId}`}
                          onClick={closeCart}
                          className="font-serif text-sm font-medium text-maroon line-clamp-2 hover:text-gold-dark"
                        >
                          {line.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-foreground/50">
                          {line.metal}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-maroon">
                          {formatPrice(line.price)}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-gold/25">
                            <button
                              type="button"
                              className="rounded-l-full p-1.5 text-maroon hover:bg-cream"
                              aria-label={`Decrease quantity of ${line.name}`}
                              onClick={() =>
                                updateQuantity(line.productId, line.quantity - 1)
                              }
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[1.75rem] text-center text-sm font-medium">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              className="rounded-r-full p-1.5 text-maroon hover:bg-cream"
                              aria-label={`Increase quantity of ${line.name}`}
                              onClick={() =>
                                updateQuantity(line.productId, line.quantity + 1)
                              }
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="rounded-full p-2 text-foreground/40 hover:bg-cream hover:text-maroon"
                            aria-label={`Remove ${line.name} from enquiries`}
                            onClick={() => removeFromCart(line.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gold/20 bg-cream/40 px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-wider text-foreground/60">
                      Estimated total
                    </span>
                    <span className="font-serif text-2xl font-semibold text-maroon">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-foreground/50">
                    Final price may vary with gold rate and customisation.
                  </p>

                  <div className="mt-5 space-y-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Enquire on WhatsApp
                    </a>
                    <a
                      href={mailtoUrl}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-maroon/25 bg-white px-5 py-3.5 text-sm font-semibold uppercase tracking-wider text-maroon transition-colors hover:bg-cream"
                    >
                      <Mail className="h-4 w-4" />
                      Enquire via Email
                    </a>
                    <p className="text-center text-xs text-foreground/45">
                      Enquiries go to {enquiryEmail}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-4 w-full text-center text-xs font-medium uppercase tracking-wider text-foreground/45 hover:text-maroon"
                  >
                    Clear enquiries
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
