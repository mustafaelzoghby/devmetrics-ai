"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  CreditCard,
  CheckCircle,
  Star,
  Zap,
  Building,
  TrendingUp,
  Users,
  ArrowUp,
  Calendar,
  Download,
} from "lucide-react";

const mockSubscriptions = [
  {
    id: "1",
    user: "Mustafa Mahmoud",
    email: "mustafa@devmetrics.ai",
    plan: "PRO",
    status: "ACTIVE",
    amount: 29,
    nextBilling: "2025-01-01",
    since: "2024-06-01",
  },
  {
    id: "2",
    user: "Ahmed Ali",
    email: "ahmed@example.com",
    plan: "ENTERPRISE",
    status: "ACTIVE",
    amount: 99,
    nextBilling: "2025-01-15",
    since: "2024-05-15",
  },
  {
    id: "3",
    user: "Sara Mohamed",
    email: "sara@example.com",
    plan: "FREE",
    status: "ACTIVE",
    amount: 0,
    nextBilling: null,
    since: "2024-10-01",
  },
  {
    id: "4",
    user: "Omar Hassan",
    email: "omar@example.com",
    plan: "PRO",
    status: "CANCELLED",
    amount: 29,
    nextBilling: null,
    since: "2024-07-01",
  },
];

const planConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  FREE: { label: "Ù…Ø¬Ø§Ù†ÙŠ", icon: Star, color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-800" },
  PRO: { label: "Pro", icon: Zap, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
  ENTERPRISE: { label: "Enterprise", icon: Building, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
};

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockSubscriptions.filter(
    (s) => s.user.toLowerCase().includes(search.toLowerCase()) || s.email.includes(search)
  );

  const totalRevenue = mockSubscriptions.filter((s) => s.status === "ACTIVE").reduce((acc, s) => acc + s.amount, 0);
  const activeCount = mockSubscriptions.filter((s) => s.status === "ACTIVE").length;
  const proCount = mockSubscriptions.filter((s) => s.plan === "PRO").length;
  const enterpriseCount = mockSubscriptions.filter((s) => s.plan === "ENTERPRISE").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground mt-1">Ø¥Ø¯Ø§Ø±Ø© Ø§Ø´ØªØ±Ø§ÙƒØ§Øª Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† ÙˆØ§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          ØªØµØ¯ÙŠØ± Ø§Ù„ØªÙ‚Ø±ÙŠØ±
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Ø§Ù„Ø¥ÙŠØ±Ø§Ø¯Ø§Øª Ø§Ù„Ø´Ù‡Ø±ÙŠØ©", value: `\$${totalRevenue}`, icon: TrendingUp, change: "+18% Ù‡Ø°Ø§ Ø§Ù„Ø´Ù‡Ø±", color: "text-green-500" },
          { label: "Ø§Ø´ØªØ±Ø§ÙƒØ§Øª Ù†Ø´Ø·Ø©", value: `${activeCount}`, icon: CheckCircle, change: "+2 Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹", color: "text-blue-500" },
          { label: "Ù…Ø´ØªØ±ÙƒÙˆ Pro", value: `${proCount}`, icon: Zap, change: "+1 Ù‡Ø°Ø§ Ø§Ù„Ø´Ù‡Ø±", color: "text-purple-500" },
          { label: "Ù…Ø´ØªØ±ÙƒÙˆ Enterprise", value: `${enterpriseCount}`, icon: Building, change: "0 ØªØºÙŠÙŠØ±", color: "text-orange-500" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Ø¨Ø­Ø« Ø¨Ø§Ù„Ø§Ø³Ù… Ø£Ùˆ Ø§Ù„Ø¥ÙŠÙ…ÙŠÙ„..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="text-right p-4 font-medium text-muted-foreground">Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Ø§Ù„Ø®Ø·Ø©</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Ø§Ù„Ø­Ø§Ù„Ø©</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Ø§Ù„Ù…Ø¨Ù„Øº/Ø´Ù‡Ø±</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Ø§Ù„ÙØ§ØªÙˆØ±Ø© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Ø¹Ø¶Ùˆ Ù…Ù†Ø°</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Ø¥Ø¬Ø±Ø§Ø¡</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((sub) => {
                  const plan = planConfig[sub.plan];
                  const PlanIcon = plan.icon;
                  return (
                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{sub.user}</p>
                          <p className="text-xs text-muted-foreground">{sub.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${plan.bg} ${plan.color}`}>
                          <PlanIcon className="h-3 w-3" />
                          {plan.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={
                            sub.status === "ACTIVE"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }
                        >
                          {sub.status === "ACTIVE" ? "Ù†Ø´Ø·" : "Ù…Ù„ØºÙŠ"}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium">{sub.amount > 0 ? `\$${sub.amount}` : "Ù…Ø¬Ø§Ù†ÙŠ"}</td>
                      <td className="p-4 text-muted-foreground">{sub.nextBilling || "â€”"}</td>
                      <td className="p-4 text-muted-foreground">{sub.since}</td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">Ø¥Ø¯Ø§Ø±Ø©</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

