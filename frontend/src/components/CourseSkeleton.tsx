import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function CourseSkeleton() {
    return (
      <div className="p-14">
        <div className="flex">
          <Skeleton className="mx-8 h-10 w-56" />
          <Skeleton className="mx-8 h-10 w-56" />
        </div>
        <div className="flex">
          <ManageCoursesSkeleton />
          <ManageCoursesSkeleton />
          <ManageCoursesSkeleton />
        </div>
      </div>
    );
  }
  
  function ManageCoursesSkeleton() {
    return (
      <div className="space-y-6 p-8">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-80" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }