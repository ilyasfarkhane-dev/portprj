import { MoreHorizontal, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function UserProfile() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile settings</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
            <DropdownMenuItem>Change Password</DropdownMenuItem>
            <DropdownMenuItem>Privacy Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-4">
        <div className="relative mb-4">
          <img src="/placeholder.svg?height=80&width=80" alt="Profile" className="h-20 w-20 rounded-full" />
          <Button
            variant="outline"
            size="icon"
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background"
          >
            <Settings className="h-3 w-3" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
        <h3 className="text-lg font-medium">Alex Johnson</h3>
        <p className="text-sm text-muted-foreground">Product Manager</p>
        <div className="mt-6 grid w-full grid-cols-2 gap-2">
          <div className="flex flex-col items-center rounded-lg border p-3">
            <span className="text-lg font-medium">28</span>
            <span className="text-xs text-muted-foreground">Projects</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border p-3">
            <span className="text-lg font-medium">142</span>
            <span className="text-xs text-muted-foreground">Tasks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
