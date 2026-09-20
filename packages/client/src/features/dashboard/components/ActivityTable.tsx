import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ActivityTableProps {
   tasks: Array<{ id: string; title: string; status: string; trackedTime: number }>;
   formatTime: (seconds: number) => string;
}

const getStatusBadge = (status: string) => {
   switch (status) {
      case 'COMPLETED':
         return (
            <Badge
               variant="secondary"
               className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-transparent"
            >
               Completed
            </Badge>
         );
      case 'IN_PROGRESS':
         return (
            <Badge
               variant="outline"
               className="border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
            >
               In Progress
            </Badge>
         );
      case 'PENDING':
      default:
         return (
            <Badge variant="outline" className="text-zinc-500">
               Pending
            </Badge>
         );
   }
};

export function ActivityTable({ tasks, formatTime }: ActivityTableProps) {
   return (
      <Card className="col-span-1 lg:col-span-4 shadow-sm border-zinc-200 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
         <CardHeader>
            <CardTitle className="text-base font-semibold">Today's Activity</CardTitle>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow className="hover:bg-transparent">
                     <TableHead className="w-[50%]">Task Name</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Time Tracked</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {tasks.length > 0 ? (
                     tasks.map((task) => (
                        <TableRow key={task.id}>
                           <TableCell className="font-medium text-zinc-900 truncate max-w-[200px]">
                              {task.title}
                           </TableCell>
                           <TableCell>{getStatusBadge(task.status)}</TableCell>
                           <TableCell className="text-right font-mono text-zinc-700 mt-1.5 block">
                              {formatTime(task.trackedTime)}
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-zinc-500">
                           No activity found for today.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}
