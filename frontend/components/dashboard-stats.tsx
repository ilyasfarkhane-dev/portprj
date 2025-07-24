import { ArrowDown, ArrowUp, DollarSign, Users, LineChart, ShoppingCart } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">+20.1%</span> from last month
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2,350</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">+180</span> from last week
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
            <span className="text-red-500">-8.1%</span> from yesterday
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">+201</span> since last hour
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
