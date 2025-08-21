<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'E-commerce';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Order Information')
                    ->schema([
                        Forms\Components\TextInput::make('order_number')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\Select::make('customer_id')
                            ->relationship('customer', 'name')
                            ->searchable()
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->options([
                                Order::STATUS_PENDING => 'Pending',
                                Order::STATUS_CONFIRMED => 'Confirmed',
                                Order::STATUS_PROCESSING => 'Processing',
                                Order::STATUS_SHIPPED => 'Shipped',
                                Order::STATUS_DELIVERED => 'Delivered',
                                Order::STATUS_CANCELLED => 'Cancelled',
                                Order::STATUS_REFUNDED => 'Refunded',
                            ])
                            ->required()
                            ->default(Order::STATUS_PENDING),
                        Forms\Components\Select::make('payment_method')
                            ->options([
                                'card' => 'Credit Card',
                                'cash_on_delivery' => 'Cash on Delivery',
                                'bank_transfer' => 'Bank Transfer',
                            ])
                            ->required(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Pricing')
                    ->schema([
                        Forms\Components\TextInput::make('subtotal')
                            ->required()
                            ->numeric()
                            ->prefix('SAR'),
                        Forms\Components\TextInput::make('tax_amount')
                            ->numeric()
                            ->prefix('SAR')
                            ->default(0),
                        Forms\Components\TextInput::make('shipping_amount')
                            ->numeric()
                            ->prefix('SAR')
                            ->default(0),
                        Forms\Components\TextInput::make('discount_amount')
                            ->numeric()
                            ->prefix('SAR')
                            ->default(0),
                        Forms\Components\TextInput::make('total')
                            ->required()
                            ->numeric()
                            ->prefix('SAR'),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Additional Information')
                    ->schema([
                        Forms\Components\Select::make('discount_id')
                            ->relationship('discount', 'code')
                            ->searchable()
                            ->nullable(),
                        Forms\Components\Select::make('shipping_address_id')
                            ->relationship('shippingAddress', 'address_details')
                            ->searchable()
                            ->nullable(),
                        Forms\Components\TextInput::make('tracking_number')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('notes')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Timestamps')
                    ->schema([
                        Forms\Components\DateTimePicker::make('shipped_at')
                            ->nullable(),
                        Forms\Components\DateTimePicker::make('delivered_at')
                            ->nullable(),
                    ])
                    ->columns(2)
                    ->visibleOn('edit'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('customer.name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('customer.phone_number')
                    ->searchable()
                    ->label('Phone'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Order::STATUS_PENDING => 'warning',
                        Order::STATUS_CONFIRMED => 'info',
                        Order::STATUS_PROCESSING => 'primary',
                        Order::STATUS_SHIPPED => 'success',
                        Order::STATUS_DELIVERED => 'success',
                        Order::STATUS_CANCELLED => 'danger',
                        Order::STATUS_REFUNDED => 'gray',
                    }),
                Tables\Columns\TextColumn::make('payment_method')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'card' => 'success',
                        'cash_on_delivery' => 'warning',
                        'bank_transfer' => 'info',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('total')
                    ->money('SAR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('item_count')
                    ->label('Items')
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        'unpaid' => 'gray',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('shipped_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('delivered_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        Order::STATUS_PENDING => 'Pending',
                        Order::STATUS_CONFIRMED => 'Confirmed',
                        Order::STATUS_PROCESSING => 'Processing',
                        Order::STATUS_SHIPPED => 'Shipped',
                        Order::STATUS_DELIVERED => 'Delivered',
                        Order::STATUS_CANCELLED => 'Cancelled',
                        Order::STATUS_REFUNDED => 'Refunded',
                    ]),
                Tables\Filters\SelectFilter::make('payment_method')
                    ->options([
                        'card' => 'Credit Card',
                        'cash_on_delivery' => 'Cash on Delivery',
                        'bank_transfer' => 'Bank Transfer',
                    ]),
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from'),
                        Forms\Components\DatePicker::make('created_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('updateStatus')
                    ->label('Update Status')
                    ->icon('heroicon-o-arrow-path')
                    ->form([
                        Forms\Components\Select::make('status')
                            ->options([
                                Order::STATUS_PENDING => 'Pending',
                                Order::STATUS_CONFIRMED => 'Confirmed',
                                Order::STATUS_PROCESSING => 'Processing',
                                Order::STATUS_SHIPPED => 'Shipped',
                                Order::STATUS_DELIVERED => 'Delivered',
                                Order::STATUS_CANCELLED => 'Cancelled',
                                Order::STATUS_REFUNDED => 'Refunded',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('notes')
                            ->label('Notes (optional)'),
                    ])
                    ->action(function (Order $record, array $data): void {
                        $record->updateStatus($data['status'], $data['notes']);
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Order Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('order_number')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                Order::STATUS_PENDING => 'warning',
                                Order::STATUS_CONFIRMED => 'info',
                                Order::STATUS_PROCESSING => 'primary',
                                Order::STATUS_SHIPPED => 'success',
                                Order::STATUS_DELIVERED => 'success',
                                Order::STATUS_CANCELLED => 'danger',
                                Order::STATUS_REFUNDED => 'gray',
                            }),
                        Infolists\Components\TextEntry::make('payment_method')
                            ->badge(),
                        Infolists\Components\TextEntry::make('created_at')
                            ->dateTime(),
                    ])
                    ->columns(2),

                Infolists\Components\Section::make('Customer Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('customer.name'),
                        Infolists\Components\TextEntry::make('customer.phone_number'),
                        Infolists\Components\TextEntry::make('shippingAddress.full_address')
                            ->label('Shipping Address'),
                    ])
                    ->columns(2),

                Infolists\Components\Section::make('Order Summary')
                    ->schema([
                        Infolists\Components\TextEntry::make('subtotal')
                            ->money('SAR'),
                        Infolists\Components\TextEntry::make('tax_amount')
                            ->money('SAR'),
                        Infolists\Components\TextEntry::make('shipping_amount')
                            ->money('SAR'),
                        Infolists\Components\TextEntry::make('discount_amount')
                            ->money('SAR'),
                        Infolists\Components\TextEntry::make('total')
                            ->money('SAR')
                            ->weight('bold'),
                    ])
                    ->columns(3),

                Infolists\Components\Section::make('Additional Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('tracking_number')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('shipped_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('delivered_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('notes')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\OrderItemsRelationManager::class,
            RelationManagers\PaymentsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', Order::STATUS_PENDING)->count();
    }
}
