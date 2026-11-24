"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Github,
  Link,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Globe,
  Lock,
  Trash2,
  Save,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">إدارة حسابك وتفضيلاتك</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            الملف
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            المظهر
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            الأمان
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1.5">
            <Link className="h-3.5 w-3.5" />
            التكاملات
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>تحديث بياناتك الشخصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://github.com/mustafaelzoghby.png" />
                  <AvatarFallback className="text-xl">MM</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">تغيير الصورة</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF — حد أقصى 5MB</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>الاسم الأول</Label>
                  <Input defaultValue="Mustafa" />
                </div>
                <div className="space-y-2">
                  <Label>الاسم الأخير</Label>
                  <Input defaultValue="Mahmoud" />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input defaultValue="mustafa@devmetrics.ai" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>اسم المستخدم</Label>
                  <Input defaultValue="mustafaelzoghby" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>الموقع</Label>
                  <Input defaultValue="Cairo, Egypt 🇪🇬" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  {saved ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      تم الحفظ!
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تحكم في الإشعارات التي تتلقاها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: Mail, label: "إشعارات البريد الإلكتروني", desc: "استقبال الإشعارات عبر الإيميل", enabled: true },
                { icon: Bell, label: "إشعارات داخل التطبيق", desc: "إشعارات فورية داخل المنصة", enabled: true },
                { icon: Smartphone, label: "إشعارات الموبايل", desc: "Push notifications للتطبيق", enabled: false },
                { icon: Github, label: "تحديثات GitHub", desc: "إشعارات عند تحديث المستودعات", enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <div
                    className={`relative h-6 w-11 rounded-full cursor-pointer transition-colors ${item.enabled ? "bg-primary" : "bg-muted"}`}
                  >
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${item.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>المظهر</CardTitle>
              <CardDescription>تخصيص مظهر المنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base">الوضع</Label>
                <p className="text-sm text-muted-foreground mb-3">اختر بين الوضع الفاتح أو الداكن</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "فاتح", icon: Sun },
                    { value: "dark", label: "داكن", icon: Moon },
                    { value: "system", label: "النظام", icon: Globe },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        theme === opt.value ? "border-primary bg-primary/5" : "border-transparent hover:border-muted-foreground/30"
                      }`}
                    >
                      <opt.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>كلمة المرور</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>كلمة المرور الحالية</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>كلمة المرور الجديدة</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button>
                  <Key className="h-4 w-4 mr-2" />
                  تغيير كلمة المرور
                </Button>
              </CardContent>
            </Card>
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">منطقة الخطر</CardTitle>
                <CardDescription>هذه الإجراءات لا يمكن التراجع عنها</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  حذف الحساب نهائياً
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>التكاملات</CardTitle>
              <CardDescription>ربط منصات خارجية بحسابك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "GitHub", icon: Github, connected: true, username: "@mustafaelzoghby", color: "text-gray-900 dark:text-white" },
                { name: "GitLab", icon: Globe, connected: false, username: null, color: "text-orange-500" },
                { name: "Bitbucket", icon: Globe, connected: false, username: null, color: "text-blue-600" },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <integration.icon className={`h-5 w-5 ${integration.color}`} />
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      {integration.connected && (
                        <p className="text-sm text-muted-foreground">{integration.username}</p>
                      )}
                    </div>
                  </div>
                  {integration.connected ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      متصل
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">ربط</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
