"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function DashboardHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 pt-4">
                <Link href="#" className="text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="#" className="text-sm font-medium text-muted-foreground">
                  Analytics
                </Link>
                <Link href="#" className="text-sm font-medium text-muted-foreground">
                  Projects
                </Link>
                <Link href="#" className="text-sm font-medium text-muted-foreground">
                  Team
                </Link>
                <Link href="#" className="text-sm font-medium text-muted-foreground">
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="#" className="text-xl font-bold">
            Dashboard
          </Link>
          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link href="#" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground">
              Analytics
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground">
              Projects
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground">
              Team
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="relative flex items-center md:hidden">
              <Input type="search" placeholder="Search..." className="w-full rounded-full pr-8" autoFocus />
              <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-[200px] rounded-full pl-8 md:w-[300px]" />
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <img src="/placeholder.svg?height=32&width=32" alt="Avatar" className="h-8 w-8 rounded-full" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
