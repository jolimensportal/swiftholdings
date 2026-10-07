import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown when the mail endpoint refuses the caller. Rendering the composer and
 * letting every action fail would be worse: the operator would write a real
 * message to a real investor and only find out at send time that it was not
 * going anywhere.
 */
export function EmailComposerSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Compose</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-9 w-28" />
        </CardContent>
      </Card>
    </div>
  );
}
