import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimeByTaskChartProps {
   tasks: Array<{ title: string; trackedTime: number }>;
}

export function TimeByTaskChart({ tasks }: TimeByTaskChartProps) {
   // Filter out tasks with no tracked time to keep chart clean
   const activeTasks = tasks.filter((t) => t.trackedTime > 0);

   // Map strictly to minutes (1 minute minimum buffer so quick test flashes render)
   const chartSeries = activeTasks.map((t) => Math.max(1, Math.round(t.trackedTime / 60)));

   // Vibrant, gorgeous UI colors instead of monotone boring black
   const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6'];

   const chartOptions: ApexCharts.ApexOptions = {
      chart: {
         type: 'donut',
         fontFamily: 'inherit',
         animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
               enabled: true,
               delay: 150,
            },
            dynamicAnimation: {
               enabled: true,
               speed: 350,
            },
         },
      },
      labels: activeTasks.map((t) => t.title),
      colors: colors,
      plotOptions: {
         pie: {
            donut: {
               size: '72%',
               labels: {
                  show: true,
                  name: {
                     show: true,
                     fontSize: '13px',
                     fontWeight: 500,
                     color: '#71717a',
                  },
                  value: {
                     show: true,
                     fontSize: '22px',
                     fontWeight: 700,
                     color: '#09090b',
                     formatter: (val) => {
                        const mins = typeof val === 'number' ? val : parseInt(val.toString(), 10);
                        const h = Math.floor(mins / 60);
                        const m = mins % 60;
                        return h > 0 ? `${h}h ${m}m` : `${m}m`;
                     },
                  },
                  total: {
                     show: true,
                     showAlways: true,
                     label: 'Total Today',
                     fontSize: '13px',
                     fontWeight: 600,
                     color: '#a1a1aa',
                     formatter: function (w) {
                        const totalMins = w.globals.seriesTotals.reduce(
                           (a: number, b: number) => a + b,
                           0
                        );
                        const h = Math.floor(totalMins / 60);
                        const m = totalMins % 60;
                        return h > 0 ? `${h}h ${m}m` : `${m}m`;
                     },
                  },
               },
            },
         },
      },
      dataLabels: {
         enabled: false,
      },
      stroke: {
         show: true,
         colors: ['#ffffff'],
         width: 4,
      },
      legend: {
         show: true,
         position: 'bottom',
         fontSize: '12px',
         fontWeight: 500,
         markers: {},
         itemMargin: {
            horizontal: 10,
            vertical: 8,
         },
      },
      tooltip: {
         theme: 'light',
         y: {
            formatter: (val: number) => {
               const h = Math.floor(val / 60);
               const m = val % 60;
               return h > 0 ? `${h}h ${m}m` : `${m}m`;
            },
         },
      },
   };

   return (
      <Card className="col-span-1 lg:col-span-3 shadow-sm border-zinc-200 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
         <CardHeader>
            <CardTitle className="text-base font-semibold">Time Distribution</CardTitle>
         </CardHeader>
         <CardContent className="h-[380px] w-full flex items-center justify-center pb-4">
            {chartSeries.length > 0 ? (
               <div className="w-full h-full flex justify-center items-center">
                  <ReactApexChart
                     options={chartOptions}
                     series={chartSeries}
                     type="donut"
                     height="100%"
                     width="100%"
                  />
               </div>
            ) : (
               <div className="text-sm text-zinc-500">No time tracked yet today.</div>
            )}
         </CardContent>
      </Card>
   );
}
