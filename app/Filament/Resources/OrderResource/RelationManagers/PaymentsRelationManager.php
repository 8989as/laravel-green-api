<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use App\Models\Payment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class PaymentsRelationManager extends RelationManager
{
    protected static string $relationship = 'payments';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
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
                    ->required(),
                Forms\Components\TextInput::make('transaction_id')
                    ->maxLength(255),
                Forms\Components\TextInput::make('gateway')
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('transaction_id')
            ->columns([
                Tables\Columns\TextColumn::make('amount')
                    ->money('SAR'),
                Tables\Columns\TextColumn::make('payment_method')
                    ->badge(),
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
                    ->copyable(),
                Tables\Columns\TextColumn::make('gateway'),
                Tables\Columns\TextColumn::make('processed_at')
                    ->dateTime(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
