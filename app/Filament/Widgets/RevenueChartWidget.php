<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class RevenueChartWidget extends ChartWidget
{
    protected static ?string $heading = 'Monthly Revenue';

    protected static ?int $sort = 4;

    protected function getData(): array
    {
        $months = collect();
        $revenues = collect();

        // Get last 12 months of data
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthRevenue = Order::where('status', Order::STATUS_DELIVERED)
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->sum('total');

            $months->push($date->format('M Y'));
            $revenues->push($monthRevenue);
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (SAR)',
                    'data' => $revenues->toArray(),
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'fill' => true,
                ],
            ],
            'labels' => $months->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
