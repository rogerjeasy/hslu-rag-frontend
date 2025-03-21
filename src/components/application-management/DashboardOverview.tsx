// src/components/application-management/DashboardOverview.tsx
'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  UsersRound,
  BookText,
  FileQuestion,
  Files,
  TrendingUp,
  BarChart4,
  AlertCircle 
} from "lucide-react"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Application Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          An overview of the application statistics and activity.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Stats grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Users" 
              value="2,856" 
              description="+12% from last month" 
              trend="up" 
              icon={<UsersRound className="h-4 w-4 text-blue-600" />} 
            />
            
            <StatsCard 
              title="Course Materials" 
              value="432" 
              description="67 materials added this month" 
              trend="up" 
              icon={<BookText className="h-4 w-4 text-emerald-600" />} 
            />
            
            <StatsCard 
              title="FAQs" 
              value="156" 
              description="24 new questions added" 
              trend="up" 
              icon={<FileQuestion className="h-4 w-4 text-purple-600" />} 
            />
            
            <StatsCard 
              title="Uploaded Files" 
              value="1,287" 
              description="127 files this month" 
              trend="up" 
              icon={<Files className="h-4 w-4 text-amber-600" />} 
            />
          </div>
          
          {/* Activity and alerts sections */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}>
                        {activity.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Showing recent 5 of 156 activities
                </p>
              </CardFooter>
            </Card>
            
            {/* System alerts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">System Alerts</CardTitle>
                <CardDescription>
                  Issues that require attention
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {systemAlerts.map((alert, i) => (
                    <div key={i} className={`flex items-start gap-4 p-3 rounded-lg ${alert.bgColor}`}>
                      <AlertCircle className={`h-5 w-5 mt-0.5 ${alert.iconColor}`} />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {alert.title}
                        </p>
                        <p className="text-sm">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Showing 3 active alerts
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="h-[400px] flex items-center justify-center border rounded-md">
          <div className="text-center">
            <BarChart4 className="h-10 w-10 mb-4 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Detailed analytics and usage statistics would be displayed here with charts and data visualizations.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="h-[400px] flex items-center justify-center border rounded-md">
          <div className="text-center">
            <Files className="h-10 w-10 mb-4 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">System Reports</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Downloadable reports and data exports would be available here for administrators.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
}

function StatsCard({ title, value, description, trend, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1 text-green-500" />}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

// Sample data
const recentActivities = [
  {
    icon: <UsersRound className="h-4 w-4 text-white" />,
    iconBg: "bg-blue-500",
    title: "User role updated",
    description: "Admin changed role for user johndoe@example.com",
    time: "10 minutes ago"
  },
  {
    icon: <BookText className="h-4 w-4 text-white" />,
    iconBg: "bg-emerald-500",
    title: "New course material added",
    description: "Machine Learning fundamentals - Week 3",
    time: "1 hour ago"
  },
  {
    icon: <Files className="h-4 w-4 text-white" />,
    iconBg: "bg-amber-500",
    title: "Files uploaded",
    description: "12 new files added to Data Science course",
    time: "2 hours ago"
  },
  {
    icon: <FileQuestion className="h-4 w-4 text-white" />,
    iconBg: "bg-purple-500",
    title: "FAQ updated",
    description: "5 new questions added to the FAQ section",
    time: "Yesterday at 15:32"
  },
  {
    icon: <UsersRound className="h-4 w-4 text-white" />,
    iconBg: "bg-blue-500",
    title: "New user registered",
    description: "sarah.smith@hslu.ch registered to the system",
    time: "Yesterday at 09:15"
  }
]

const systemAlerts = [
  {
    title: "Storage space running low",
    description: "25GB of 30GB used (83%). Consider cleaning up files.",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50"
  },
  {
    title: "System update required",
    description: "New security update available for the application.",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "API rate limit approaching",
    description: "External API usage at 85% of daily limit.",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50"
  }
]