"use client";

import { useState } from "react";
import { SiteSettingsContent } from "@/features/settings/components/site-settings-content";
import { PaymentSettingsContent } from "@/features/settings/components/payment-settings-content";
import { OrderSettingsContent } from "@/features/settings/components/order-settings-content";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "site", label: "Site Settings" },
  { id: "payment", label: "Payment Settings" },
  { id: "order", label: "Order Settings" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("site");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-darkText">Settings</h1>
        <p className="text-muted-foreground">Manage your site configuration.</p>
      </div>

      <div className="border-b border-border">
        <nav className="flex gap-4 overflow-x-auto pb-1 sm:gap-6" aria-label="Settings tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-maroon text-maroon"
                  : "border-transparent text-muted-foreground hover:text-darkText"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "site" && <SiteSettingsContent />}
        {activeTab === "payment" && <PaymentSettingsContent />}
        {activeTab === "order" && <OrderSettingsContent />}
      </div>
    </div>
  );
}
