import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimeByTaskChartProps {
   tasks: Array<{ title: string; trackedTime: number }>;
}

export function TimeByTaskChart({ tasks }: TimeByTaskChartProps) {
   const chartSeries = [
      {
         name: 'Tracked Time',
         data: tasks.map((t) => Math.floor(t.trackedTime / 60)),
      },
   ];

   const chartOptions: ApexCharts.ApexOptions = {
      chart: {
         type: 'bar',
         toolbar: { show: false },
         fontFamily: 'inherit',
         zoom: { enabled: false },
      },
      plotOptions: {
         bar: {
            borderRadius: 4,
            horizontal: true,
            barHeight: '50%',
         },
      },
      colors: ['#09090b'], // Zinc 950
      dataLabels: { enabled: false },
      xaxis: {
         categories: tasks.map((t) => t.title),
         labels: { style: { colors: '#71717a' } },
         axisBorder: { show: false },
         axisTicks: { show: false },
         title: {
            text: 'Minutes logged',
            style: { color: '#a1a1aa', fontWeight: 500, fontSize: '12px' },
         },
      },
      yaxis: {
         labels: {
            style: { colors: '#09090b', fontWeight: 500 },
            maxWidth: 180,
         },
      },
      grid: {
         borderColor: '#f4f4f5',
         strokeDashArray: 4,
         xaxis: { lines: { show: true } },
         yaxis: { lines: { show: false } },
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
            <CardTitle className="text-base font-semibold">Time by Task</CardTitle>
         </CardHeader>
         <CardContent className="h-[350px] w-full flex items-center justify-center">
            {tasks.length > 0 ? (
               <div className="w-full h-full -ml-3">
                  <ReactApexChart
                     options={chartOptions}
                     series={chartSeries}
                     type="bar"
                     height="100%"
                  />
               </div>
            ) : (
               <div className="text-sm text-zinc-500">No time tracked yet today.</div>
            )}
         </CardContent>
      </Card>
   );
}
