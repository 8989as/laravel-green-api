<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class OrderStatusChartWidget extends ChartWidget
{
    protected static ?string $heading = 'Order Status Distribution';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $statusCounts = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $labels = [];
        $data = [];
        $colors = [];

        $statusConfig = [
            Order::STATUS_PENDING => ['label' => 'Pending', 'color' => '#f59e0b'],
            Order::STATUS_CONFIRMED => ['label' => 'Confirmed', 'color' => '#3b82f6'],
            Order::STATUS_PROCESSING => ['label' => 'Processing', 'color' => '#8b5cf6'],
            Order::STATUS_SHIPPED => ['label' => 'Shipped', 'color' => '#10b981'],
            Order::STATUS_DELIVERED => ['label' => 'Delivered', 'color' => '#059669'],
            Order::STATUS_CANCELLED => ['label' => 'Cancelled', 'color' => '#ef4444'],
            Order::STATUS_REFUNDED => ['label' => 'Refunded', 'color' => '#6b7280'],
        ];

        foreach ($statusConfig as $status => $config) {
            if (isset($statusCounts[$status]) && $statusCounts[$status] > 0) {
                $labels[] = $config['label'];
                $data[] = $statusCounts[$status];
                $colors[] = $config['color'];
            }
        }

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $data,
                    'backgroundColor' => $colors,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
