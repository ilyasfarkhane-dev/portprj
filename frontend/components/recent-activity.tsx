import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentActivity() {
  const activities = [
    {
      user: {
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "OM",
      },
      action: "Purchased Pro Plan",
      timestamp: "2 minutes ago",
    },
    {
      user: {
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JL",
      },
      action: "Subscribed to Basic Plan",
      timestamp: "42 minutes ago",
    },
    {
      user: {
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "IN",
      },
      action: "Upgraded to Business Plan",
      timestamp: "1 hour ago",
    },
    {
      user: {
        name: "William Kim",
        email: "will.kim@email.com",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "WK",
      },
      action: "Cancelled subscription",
      timestamp: "3 hours ago",
    },
    {
      user: {
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SD",
      },
      action: "Submitted a ticket",
      timestamp: "5 hours ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>You have {activities.length} activities today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.user.name}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
