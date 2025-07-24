import { Calendar } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function UpcomingEvents() {
  const events = [
    {
      title: "Team Meeting",
      date: "March 14, 2025",
      time: "10:00 AM",
    },
    {
      title: "Product Launch",
      date: "March 18, 2025",
      time: "9:30 AM",
    },
    {
      title: "Client Presentation",
      date: "March 20, 2025",
      time: "2:00 PM",
    },
    {
      title: "Strategy Review",
      date: "March 25, 2025",
      time: "11:00 AM",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Calendar className="h-5 w-5" />
        <div>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>You have {events.length} upcoming events</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <h3 className="font-medium leading-none">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {event.date} at {event.time}
              </p>
              {index < events.length - 1 && <hr className="my-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
