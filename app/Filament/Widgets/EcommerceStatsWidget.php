<?php

namespace App\Filament\Widgets;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Payment;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class EcommerceStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalRevenue = Order::where('status', Order::STATUS_DELIVERED)->sum('total');
        $pendingOrders = Order::where('status', Order::STATUS_PENDING)->count();
        $totalCustomers = Customer::count();
        $successfulPayments = Payment::where('status', Payment::STATUS_COMPLETED)->count();

        // Calculate revenue for this month and last month for comparison
        $thisMonthRevenue = Order::where('status', Order::STATUS_DELIVERED)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total');

        $lastMonthRevenue = Order::where('status', Order::STATUS_DELIVERED)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('total');

        $revenueChange = $lastMonthRevenue > 0
            ? (($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : 0;

        // Calculate new customers this month
        $thisMonthCustomers = Customer::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $lastMonthCustomers = Customer::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();

        $customerChange = $lastMonthCustomers > 0
            ? (($thisMonthCustomers - $lastMonthCustomers) / $lastMonthCustomers) * 100
            : 0;

        return [
            Stat::make('Total Revenue', 'SAR '.number_format($totalRevenue, 2))
                ->description($revenueChange >= 0 ? '+'.number_format($revenueChange, 1).'% from last month' : number_format($revenueChange, 1).'% from last month')
                ->descriptionIcon($revenueChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueChange >= 0 ? 'success' : 'danger'),

            Stat::make('Pending Orders', $pendingOrders)
                ->description('Orders awaiting processing')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Total Customers', number_format($totalCustomers))
                ->description($customerChange >= 0 ? '+'.number_format($customerChange, 1).'% from last month' : number_format($customerChange, 1).'% from last month')
                ->descriptionIcon($customerChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($customerChange >= 0 ? 'success' : 'danger'),

            Stat::make('Successful Payments', number_format($successfulPayments))
                ->description('Completed transactions')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
        ];
    }
}
