"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Permission } from "@/lib/auth/auth";
import HasPermission from "../components/has-permission";
import { UserManagement } from "./components/user-management";
// import { UserPreferences } from "./components/user-preferences";
import { UserProfileForm } from "./components/user-profile-form";
import { SiteManagement } from "./components/site-management";

export function SettingsClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings
        </p>
      </div>

      <Tabs defaultValue="general" className="">
        <TabsList className="w-44 ">
          <TabsTrigger className="cursor-pointer" value="general">
            General
          </TabsTrigger>
          <HasPermission permission={Permission.MANAGE_USERS}>
            <TabsTrigger className="cursor-pointer" value="advanced">
              Advanced
            </TabsTrigger>
          </HasPermission>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfileForm />
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your application experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserPreferences />
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Invite users and manage roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
              <UserManagement />
              <SiteManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
