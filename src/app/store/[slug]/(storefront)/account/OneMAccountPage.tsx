"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist";
import { User, Package, Heart, Truck, MapPin, Trash2, ChevronDown, ChevronUp, LogOut, CheckCircle, AlertCircle } from "lucide-react";

interface OneMAccountPageProps {
  slug: string;
  user: any;
  store: any;
  initialOrders: any[];
}

type Section = "information" | "orders" | "wishlist" | "tracking";

export default function OneMAccountPage({ slug, user, store, initialOrders }: OneMAccountPageProps) {
  const accent = store?.settings?.colorSystem?.brand?.primary || store?.primaryColor || "#e1205e";
  const [activeSection, setActiveSection] = useState<Section>("information");
  const [orders] = useState(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { items: wishlistItems, removeItem } = useWishlistStore();
  const storeWishlist = wishlistItems.filter(i => i.storeId === store.id);

  const userFirst = user?.name?.split(" ")[0] || "";
  const userLast = user?.name?.split(" ").slice(1).join(" ") || "";
  const [formFirstName, setFormFirstName] = useState(userFirst);
  const [formLastName, setFormLastName] = useState(userLast);
  const [formEmail, setFormEmail] = useState(user?.email || "");
  const [formGender, setFormGender] = useState(user?.gender || "");
  const [formBirthday, setFormBirthday] = useState(user?.birthday || "");
  const [formCurrentPassword, setFormCurrentPassword] = useState("");
  const [formNewPassword, setFormNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setFormFirstName(user?.name?.split(" ")[0] || "");
    setFormLastName(user?.name?.split(" ").slice(1).join(" ") || "");
    setFormEmail(user?.email || "");
    setFormGender(user?.gender || "");
    setFormBirthday(user?.birthday || "");
  }, [user]);

  const handleSaveInfo = useCallback(async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`/api/store/${slug}/account`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          firstName: formFirstName,
          lastName: formLastName,
          email: formEmail,
          gender: formGender || null,
          birthday: formBirthday || null,
          currentPassword: formCurrentPassword || undefined,
          newPassword: formNewPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setSaveMessage({ type: "error", text: data.error || "Failed to save" });
      } else {
        setSaveMessage({ type: "success", text: "Information updated successfully." });
        setFormCurrentPassword("");
        setFormNewPassword("");
        if (data.user?.name) {
          user.name = data.user.name;
        }
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setSaving(false);
    }
  }, [slug, user, formFirstName, formLastName, formEmail, formGender, formBirthday, formCurrentPassword, formNewPassword]);

  const sections: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: "information", label: "Information", icon: <User size={16} /> },
    { key: "orders", label: "Order History", icon: <Package size={16} /> },
    { key: "wishlist", label: "Wishlist", icon: <Heart size={16} /> },
    { key: "tracking", label: "Tracking", icon: <Truck size={16} /> },
  ];

  const statusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "paid": return "Paid";
      case "processing": return "Processing";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "#f59e0b";
      case "paid": return "#3b82f6";
      case "processing": return "#6366f1";
      case "shipped": return "#8b5cf6";
      case "delivered": return "#16a34a";
      case "cancelled": return "#dc2626";
      default: return "#666666";
    }
  };

  const handleLogout = () => {
    document.cookie = "userId=; path=/; max-age=0; SameSite=Lax";
    window.location.href = `/store/${slug}`;
  };

  return (
    <div className="font-['Poppins',sans-serif]" style={{ color: "#333333" }}>
      <div className="max-w-[1170px] mx-auto" style={{ padding: "0px 15px" }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider py-4 mb-6" style={{ color: "#999999" }}>
          <Link href={`/store/${slug}`} className="hover:opacity-60 transition-opacity">Home</Link>
          <span>/</span>
          <span style={{ color: "#333333" }}>My Account</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10 mb-16">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1" style={{ color: "#333333" }}>{user?.name || "Customer"}</h2>
              <p className="text-xs" style={{ color: "#999999" }}>{user?.email}</p>
            </div>
            <nav className="flex flex-col gap-1">
              {sections.map((sec) => (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  className="flex items-center gap-3 px-4 py-3 text-sm transition-all text-left"
                  style={{
                    backgroundColor: activeSection === sec.key ? "#f7f7f7" : "transparent",
                    color: activeSection === sec.key ? accent : "#666666",
                    borderLeft: activeSection === sec.key ? `3px solid ${accent}` : "3px solid transparent"
                  }}
                >
                  {sec.icon}
                  <span className="font-medium">{sec.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm transition-all text-left mt-4"
                style={{ color: "#999999" }}
              >
                <LogOut size={16} />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeSection === "information" && (
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#333333" }}>Information</h3>
                <p className="text-xs mb-6" style={{ color: "#999999" }}>Update your personal information</p>

                <div className="max-w-lg space-y-5">
                  {/* Social title */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Social Title</label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#333333" }}>
                        <input
                          type="radio"
                          name="gender"
                          value="Mr"
                          checked={formGender === "Mr"}
                          onChange={() => setFormGender("Mr")}
                          className="accent-[var(--accent)]"
                          style={{ accentColor: accent }}
                        />
                        Mr.
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#333333" }}>
                        <input
                          type="radio"
                          name="gender"
                          value="Mrs"
                          checked={formGender === "Mrs"}
                          onChange={() => setFormGender("Mrs")}
                          className="accent-[var(--accent)]"
                          style={{ accentColor: accent }}
                        />
                        Mrs.
                      </label>
                    </div>
                  </div>

                  {/* First name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>First Name</label>
                    <input
                      type="text"
                      value={formFirstName}
                      onChange={(e) => setFormFirstName(e.target.value)}
                      className="w-full text-sm px-0 py-2 bg-transparent outline-none transition-colors"
                      style={{ color: "#333333", borderBottom: "1px solid #e5e5e5" }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = accent; }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = "#e5e5e5"; }}
                    />
                  </div>

                  {/* Last name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Last Name</label>
                    <input
                      type="text"
                      value={formLastName}
                      onChange={(e) => setFormLastName(e.target.value)}
                      className="w-full text-sm px-0 py-2 bg-transparent outline-none transition-colors"
                      style={{ color: "#333333", borderBottom: "1px solid #e5e5e5" }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = accent; }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = "#e5e5e5"; }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Email</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full text-sm px-0 py-2 bg-transparent outline-none transition-colors"
                      style={{ color: "#333333", borderBottom: "1px solid #e5e5e5" }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = accent; }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = "#e5e5e5"; }}
                    />
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Birthdate</label>
                    <input
                      type="date"
                      value={formBirthday}
                      onChange={(e) => setFormBirthday(e.target.value)}
                      className="w-full text-sm px-0 py-2 bg-transparent outline-none transition-colors"
                      style={{ color: "#333333", borderBottom: "1px solid #e5e5e5" }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = accent; }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = "#e5e5e5"; }}
                    />
                  </div>

                  {/* Password section */}
                  <div className="pt-4" style={{ borderTop: "1px solid #f0f0f0" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#999999" }}>Password</p>

                    {/* Current password */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Current Password</label>
                      <input
                        type="password"
                        value={formCurrentPassword}
                        onChange={(e) => setFormCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full text-sm px-0 py-2 bg-transparent outline-none transition-colors"
                        style={{ color: "#333333", borderBottom: "1px solid #e5e5e5" }}
                        onFocus={(e) => { e.currentTarget.style.borderBottomColor = accent; }}
                        onBlur={(e) => { e.currentTarget.style.borderBottomColor = "#e5e5e5"; }}
                      />
                    </div>

                    {/* New password */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>New Password</label>
                      <input
                        type="password"
                        value={formNewPassword}
                        onChange={(e) => setFormNewPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        className="w-full text-sm px-0 py-2 bg-transparent outline-none transition-colors"
                        style={{ color: "#333333", borderBottom: "1px solid #e5e5e5" }}
                        onFocus={(e) => { e.currentTarget.style.borderBottomColor = accent; }}
                        onBlur={(e) => { e.currentTarget.style.borderBottomColor = "#e5e5e5"; }}
                      />
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={handleSaveInfo}
                      disabled={saving}
                      className="px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 disabled:opacity-50"
                      style={{ backgroundColor: accent, color: "#ffffff" }}
                      onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#ef3444"; }}
                      onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = accent; }}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    {saveMessage && (
                      <span className={`flex items-center gap-1.5 text-xs ${saveMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                        {saveMessage.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {saveMessage.text}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "orders" && (
              <div>
                <h3 className="text-lg font-semibold mb-6" style={{ color: "#333333" }}>Order History</h3>
                {(() => {
                  const completedOrders = orders.filter((o: any) => o.status === "delivered" || o.status === "cancelled");
                  return completedOrders.length === 0 ? (
                    <div className="text-center py-16">
                      <Package size={40} className="mx-auto mb-4" style={{ color: "#cccccc" }} />
                      <p className="text-sm mb-4" style={{ color: "#999999" }}>No completed orders yet.</p>
                      <Link href={`/store/${slug}/products`} className="inline-block px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300" style={{ backgroundColor: accent, color: "#ffffff" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ef3444"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedOrders.map((order: any) => (
                      <div key={order.id} style={{ border: "1px solid #e5e5e5" }}>
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-[#fafafa] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "#f7f7f7" }}>
                              <Package size={18} style={{ color: statusColor(order.status) }} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: "#333333" }}>
                                Order #{order.id.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-xs" style={{ color: "#999999" }}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-semibold px-3 py-1" style={{ backgroundColor: `${statusColor(order.status)}15`, color: statusColor(order.status) }}>
                              {statusLabel(order.status)}
                            </span>
                            <span className="text-sm font-semibold" style={{ color: "#333333" }}>${order.totalAmount.toFixed(2)}</span>
                            {expandedOrder === order.id ? <ChevronUp size={16} style={{ color: "#999999" }} /> : <ChevronDown size={16} style={{ color: "#999999" }} />}
                          </div>
                        </button>
                        {expandedOrder === order.id && (
                          <div style={{ borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
                            <div className="p-4 space-y-3">
                              {order.items.map((item: any) => {
                                const images = typeof item.product?.images === "string" ? JSON.parse(item.product.images) : item.product?.images || [];
                                return (
                                  <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-16 h-16 shrink-0 overflow-hidden" style={{ backgroundColor: "#f0f0f0" }}>
                                      {images[0] ? (
                                        <img src={images[0]} alt={item.product?.name || ""} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "#cccccc" }}>No img</div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium" style={{ color: "#333333" }}>{item.product?.name || "Product"}</p>
                                      <p className="text-xs" style={{ color: "#999999" }}>
                                        Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ""} {item.color ? `· Color: ${item.color}` : ""}
                                      </p>
                                    </div>
                                    <p className="text-sm font-semibold" style={{ color: "#333333" }}>${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                );
                              })}
                              <div className="pt-3 flex justify-between text-xs" style={{ borderTop: "1px solid #e5e5e5", color: "#666666" }}>
                                <span>Shipping: {order.shippingAddress || "N/A"}</span>
                                <span>{order.paymentMethod ? `Payment: ${order.paymentMethod}` : ""}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  )
                })()}
              </div>
            )}

            {activeSection === "wishlist" && (
              <div>
                <h3 className="text-lg font-semibold mb-6" style={{ color: "#333333" }}>Wishlist ({storeWishlist.length})</h3>
                {storeWishlist.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart size={40} className="mx-auto mb-4" style={{ color: "#cccccc" }} />
                    <p className="text-sm mb-4" style={{ color: "#999999" }}>Your wishlist is empty.</p>
                    <Link href={`/store/${slug}/products`} className="inline-block px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300" style={{ backgroundColor: accent, color: "#ffffff" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ef3444"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {storeWishlist.map((item) => (
                      <div key={item.productId} className="flex items-center gap-4 p-4" style={{ border: "1px solid #e5e5e5" }}>
                        <Link href={`/store/${slug}/product/${item.productId}`} className="w-20 h-20 shrink-0 overflow-hidden" style={{ backgroundColor: "#f7f7f7" }}>
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/store/${slug}/product/${item.productId}`} className="text-sm font-medium hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>
                            {item.name}
                          </Link>
                          <p className="text-sm font-semibold mt-1" style={{ color: accent }}>${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 hover:opacity-60 transition-opacity"
                          style={{ color: "#999999" }}
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "tracking" && (
              <div>
                <h3 className="text-lg font-semibold mb-6" style={{ color: "#333333" }}>Tracking</h3>
                {(() => {
                  const activeOrders = orders.filter((o: any) => o.status !== "delivered" && o.status !== "cancelled");
                  return activeOrders.length === 0 ? (
                    <div className="text-center py-16">
                      <Truck size={40} className="mx-auto mb-4" style={{ color: "#cccccc" }} />
                      <p className="text-sm" style={{ color: "#999999" }}>No active orders to track.</p>
                      <p className="text-xs mt-2" style={{ color: "#cccccc" }}>Orders that are pending, paid, processing, or shipped will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeOrders.map((order: any) => (
                      <div key={order.id} style={{ border: "1px solid #e5e5e5" }}>
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-[#fafafa] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "#f7f7f7" }}>
                              <Truck size={18} style={{ color: statusColor(order.status) }} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: "#333333" }}>
                                Order #{order.id.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-xs" style={{ color: "#999999" }}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold" style={{ color: "#333333" }}>${order.totalAmount.toFixed(2)}</span>
                            <span className="text-xs font-semibold px-3 py-1" style={{ backgroundColor: `${statusColor(order.status)}15`, color: statusColor(order.status) }}>
                              {statusLabel(order.status)}
                            </span>
                            {expandedOrder === order.id ? <ChevronUp size={16} style={{ color: "#999999" }} /> : <ChevronDown size={16} style={{ color: "#999999" }} />}
                          </div>
                        </button>
                        {expandedOrder === order.id && (
                          <div style={{ borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
                            <div className="p-4 space-y-3">
                              {order.items.map((item: any) => {
                                const images = typeof item.product?.images === "string" ? JSON.parse(item.product.images) : item.product?.images || [];
                                return (
                                  <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-16 h-16 shrink-0 overflow-hidden" style={{ backgroundColor: "#f0f0f0" }}>
                                      {images[0] ? (
                                        <img src={images[0]} alt={item.product?.name || ""} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "#cccccc" }}>No img</div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium" style={{ color: "#333333" }}>{item.product?.name || "Product"}</p>
                                      <p className="text-xs" style={{ color: "#999999" }}>
                                        Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ""} {item.color ? `· Color: ${item.color}` : ""}
                                      </p>
                                    </div>
                                    <p className="text-sm font-semibold" style={{ color: "#333333" }}>${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                );
                              })}
                              <div className="pt-3 flex justify-between text-xs" style={{ borderTop: "1px solid #e5e5e5", color: "#666666" }}>
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} />
                                  <span>{order.shippingAddress || "N/A"}</span>
                                </div>
                                <span>{order.paymentMethod ? `Payment: ${order.paymentMethod}` : ""}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
