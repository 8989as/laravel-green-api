<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentResource\Pages;
use App\Models\Payment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PaymentResource extends Resource
{
    protected static ?string $model = Payment::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';

    protected static ?string $navigationGroup = 'E-commerce';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Payment Information')
                    ->schema([
                        Forms\Components\Select::make('order_id')
                            ->relationship('order', 'order_number')
                            ->searchable()
                            ->required(),
                        Forms\Components\TextInput::make('amount')
                            ->required()
                            ->numeric()
                            ->prefix('SAR'),
                        Forms\Components\Select::make('payment_method')
                            ->options([
                                Payment::PAYMENT_METHOD_CARD => 'Credit Card',
                                Payment::PAYMENT_METHOD_CASH_ON_DELIVERY => 'Cash on Delivery',
                                Payment::PAYMENT_METHOD_BANK_TRANSFER => 'Bank Transfer',
                            ])
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->options([
                                Payment::STATUS_PENDING => 'Pending',
                                Payment::STATUS_PROCESSING => 'Processing',
                                Payment::STATUS_COMPLETED => 'Completed',
                                Payment::STATUS_FAILED => 'Failed',
                                Payment::STATUS_CANCELLED => 'Cancelled',
                                Payment::STATUS_REFUNDED => 'Refunded',
                            ])
                            ->required()
                            ->default(Payment::STATUS_PENDING),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Transaction Details')
                    ->schema([
                        Forms\Components\TextInput::make('transaction_id')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('gateway')
                            ->maxLength(255),
                        Forms\Components\DateTimePicker::make('processed_at')
                            ->nullable(),
                        Forms\Components\Textarea::make('failure_reason')
                            ->maxLength(500),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Gateway Response')
                    ->schema([
                        Forms\Components\KeyValue::make('gateway_response')
                            ->keyLabel('Key')
                            ->valueLabel('Value')
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order.order_number')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('order.customer.name')
                    ->searchable()
                    ->label('Customer'),
                Tables\Columns\TextColumn::make('amount')
                    ->money('SAR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('payment_method')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Payment::PAYMENT_METHOD_CARD => 'success',
                        Payment::PAYMENT_METHOD_CASH_ON_DELIVERY => 'warning',
                        Payment::PAYMENT_METHOD_BANK_TRANSFER => 'info',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Payment::STATUS_PENDING => 'warning',
                        Payment::STATUS_PROCESSING => 'primary',
                        Payment::STATUS_COMPLETED => 'success',
                        Payment::STATUS_FAILED => 'danger',
                        Payment::STATUS_CANCELLED => 'gray',
                        Payment::STATUS_REFUNDED => 'info',
                    }),
                Tables\Columns\TextColumn::make('transaction_id')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('gateway')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('processed_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        Payment::STATUS_PENDING => 'Pending',
                        Payment::STATUS_PROCESSING => 'Processing',
                        Payment::STATUS_COMPLETED => 'Completed',
                        Payment::STATUS_FAILED => 'Failed',
                        Payment::STATUS_CANCELLED => 'Cancelled',
                        Payment::STATUS_REFUNDED => 'Refunded',
                    ]),
                Tables\Filters\SelectFilter::make('payment_method')
                    ->options([
                        Payment::PAYMENT_METHOD_CARD => 'Credit Card',
                        Payment::PAYMENT_METHOD_CASH_ON_DELIVERY => 'Cash on Delivery',
                        Payment::PAYMENT_METHOD_BANK_TRANSFER => 'Bank Transfer',
                    ]),
                Tables\Filters\SelectFilter::make('gateway')
                    ->options([
                        'stripe' => 'Stripe',
                        'paypal' => 'PayPal',
                        'mada' => 'Mada',
                        'visa' => 'Visa',
                        'mastercard' => 'Mastercard',
                    ]),
                Tables\Filters\Filter::make('processed_at')
                    ->form([
                        Forms\Components\DatePicker::make('processed_from'),
                        Forms\Components\DatePicker::make('processed_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['processed_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('processed_at', '>=', $date),
                            )
                            ->when(
                                $data['processed_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('processed_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('markAsCompleted')
                    ->label('Mark as Completed')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (Payment $record): bool => $record->is_pending)
                    ->form([
                        Forms\Components\TextInput::make('transaction_id')
                            ->label('Transaction ID'),
                        Forms\Components\KeyValue::make('gateway_response')
                            ->label('Gateway Response')
                            ->keyLabel('Key')
                            ->valueLabel('Value'),
                    ])
                    ->action(function (Payment $record, array $data): void {
                        $record->markAsCompleted($data['transaction_id'], $data['gateway_response']);
                    }),
                Tables\Actions\Action::make('markAsFailed')
                    ->label('Mark as Failed')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (Payment $record): bool => $record->is_pending)
                    ->form([
                        Forms\Components\Textarea::make('failure_reason')
                            ->label('Failure Reason')
                            ->required(),
                        Forms\Components\KeyValue::make('gateway_response')
                            ->label('Gateway Response')
                            ->keyLabel('Key')
                            ->valueLabel('Value'),
                    ])
                    ->action(function (Payment $record, array $data): void {
                        $record->markAsFailed($data['failure_reason'], $data['gateway_response']);
                    }),
                Tables\Actions\Action::make('processRefund')
                    ->label('Process Refund')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('warning')
                    ->visible(fn (Payment $record): bool => $record->is_successful)
                    ->form([
                        Forms\Components\TextInput::make('refund_amount')
                            ->label('Refund Amount')
                            ->numeric()
                            ->prefix('SAR')
                            ->default(fn (Payment $record): float => $record->amount),
                        Forms\Components\Textarea::make('refund_reason')
                            ->label('Refund Reason')
                            ->required(),
                    ])
                    ->action(function (Payment $record, array $data): void {
                        $record->processRefund($data['refund_amount'], $data['refund_reason']);
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
                Infolists\Components\Section::make('Payment Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('order.order_number')
                            ->label('Order Number')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('amount')
                            ->money('SAR'),
                        Infolists\Components\TextEntry::make('payment_method')
                            ->badge(),
                        Infolists\Components\TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                Payment::STATUS_PENDING => 'warning',
                                Payment::STATUS_PROCESSING => 'primary',
                                Payment::STATUS_COMPLETED => 'success',
                                Payment::STATUS_FAILED => 'danger',
                                Payment::STATUS_CANCELLED => 'gray',
                                Payment::STATUS_REFUNDED => 'info',
                            }),
                    ])
                    ->columns(2),

                Infolists\Components\Section::make('Transaction Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('transaction_id')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('gateway'),
                        Infolists\Components\TextEntry::make('processed_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('failure_reason')
                            ->visible(fn (Payment $record): bool => ! empty($record->failure_reason)),
                    ])
                    ->columns(2),

                Infolists\Components\Section::make('Customer Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('order.customer.name'),
                        Infolists\Components\TextEntry::make('order.customer.phone_number'),
                    ])
                    ->columns(2),

                Infolists\Components\Section::make('Gateway Response')
                    ->schema([
                        Infolists\Components\KeyValueEntry::make('gateway_response')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->visible(fn (Payment $record): bool => ! empty($record->gateway_response)),

                Infolists\Components\Section::make('Timestamps')
                    ->schema([
                        Infolists\Components\TextEntry::make('created_at')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('updated_at')
                            ->dateTime(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPayments::route('/'),
            'create' => Pages\CreatePayment::route('/create'),
            'view' => Pages\ViewPayment::route('/{record}'),
            'edit' => Pages\EditPayment::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', Payment::STATUS_PENDING)->count();
    }
}
