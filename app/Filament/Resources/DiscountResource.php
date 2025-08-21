<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DiscountResource\Pages;
use App\Filament\Resources\DiscountResource\RelationManagers;
use App\Models\Discount;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class DiscountResource extends Resource
{
    protected static ?string $model = Discount::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $navigationGroup = 'E-commerce';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Discount Information')
                    ->schema([
                        Forms\Components\TextInput::make('code')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(50)
                            ->uppercase()
                            ->helperText('Discount code will be automatically converted to uppercase'),
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description')
                            ->maxLength(500)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Discount Settings')
                    ->schema([
                        Forms\Components\Select::make('type')
                            ->options([
                                Discount::TYPE_PERCENTAGE => 'Percentage',
                                Discount::TYPE_FIXED_AMOUNT => 'Fixed Amount',
                            ])
                            ->required()
                            ->reactive(),
                        Forms\Components\TextInput::make('value')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->suffix(fn (Forms\Get $get): string => $get('type') === Discount::TYPE_PERCENTAGE ? '%' : 'SAR'
                            )
                            ->helperText(fn (Forms\Get $get): string => $get('type') === Discount::TYPE_PERCENTAGE
                                    ? 'Enter percentage value (e.g., 10 for 10%)'
                                    : 'Enter fixed amount in SAR'
                            ),
                        Forms\Components\TextInput::make('minimum_amount')
                            ->numeric()
                            ->minValue(0)
                            ->prefix('SAR')
                            ->helperText('Minimum order amount required to use this discount'),
                        Forms\Components\TextInput::make('maximum_discount')
                            ->numeric()
                            ->minValue(0)
                            ->prefix('SAR')
                            ->visible(fn (Forms\Get $get): bool => $get('type') === Discount::TYPE_PERCENTAGE)
                            ->helperText('Maximum discount amount for percentage discounts'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Usage Limits')
                    ->schema([
                        Forms\Components\TextInput::make('usage_limit')
                            ->numeric()
                            ->minValue(1)
                            ->helperText('Total number of times this discount can be used (leave empty for unlimited)'),
                        Forms\Components\TextInput::make('usage_limit_per_customer')
                            ->numeric()
                            ->minValue(1)
                            ->helperText('Number of times each customer can use this discount (leave empty for unlimited)'),
                        Forms\Components\TextInput::make('used_count')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->helperText('Current usage count'),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Validity Period')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->required()
                            ->default(true),
                        Forms\Components\DateTimePicker::make('starts_at')
                            ->helperText('When this discount becomes active (leave empty for immediate activation)'),
                        Forms\Components\DateTimePicker::make('expires_at')
                            ->helperText('When this discount expires (leave empty for no expiration)'),
                    ])
                    ->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Discount::TYPE_PERCENTAGE => 'success',
                        Discount::TYPE_FIXED_AMOUNT => 'info',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('formatted_value')
                    ->label('Value')
                    ->sortable('value'),
                Tables\Columns\TextColumn::make('minimum_amount')
                    ->money('SAR')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('usage_limit')
                    ->alignCenter()
                    ->placeholder('Unlimited')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('used_count')
                    ->label('Used')
                    ->alignCenter()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                Tables\Columns\TextColumn::make('starts_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\IconColumn::make('is_valid')
                    ->label('Valid')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('warning'),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        Discount::TYPE_PERCENTAGE => 'Percentage',
                        Discount::TYPE_FIXED_AMOUNT => 'Fixed Amount',
                    ]),
                Tables\Filters\TernaryFilter::make('is_expired')
                    ->label('Expired')
                    ->queries(
                        true: fn (Builder $query) => $query->where('expires_at', '<', now()),
                        false: fn (Builder $query) => $query->where(function ($q) {
                            $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
                        }),
                    ),
                Tables\Filters\TernaryFilter::make('usage_limit_reached')
                    ->label('Usage Limit Reached')
                    ->queries(
                        true: fn (Builder $query) => $query->whereNotNull('usage_limit')
                            ->whereRaw('used_count >= usage_limit'),
                        false: fn (Builder $query) => $query->where(function ($q) {
                            $q->whereNull('usage_limit')->orWhereRaw('used_count < usage_limit');
                        }),
                    ),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('duplicate')
                    ->label('Duplicate')
                    ->icon('heroicon-o-document-duplicate')
                    ->color('gray')
                    ->action(function (Discount $record): void {
                        $newDiscount = $record->replicate();
                        $newDiscount->code = $record->code.'_COPY';
                        $newDiscount->used_count = 0;
                        $newDiscount->save();
                    }),
                Tables\Actions\Action::make('toggle')
                    ->label(fn (Discount $record): string => $record->is_active ? 'Deactivate' : 'Activate')
                    ->icon(fn (Discount $record): string => $record->is_active ? 'heroicon-o-pause' : 'heroicon-o-play')
                    ->color(fn (Discount $record): string => $record->is_active ? 'warning' : 'success')
                    ->action(function (Discount $record): void {
                        $record->update(['is_active' => ! $record->is_active]);
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('activate')
                        ->label('Activate')
                        ->icon('heroicon-o-play')
                        ->color('success')
                        ->action(function ($records): void {
                            foreach ($records as $record) {
                                $record->update(['is_active' => true]);
                            }
                        }),
                    Tables\Actions\BulkAction::make('deactivate')
                        ->label('Deactivate')
                        ->icon('heroicon-o-pause')
                        ->color('warning')
                        ->action(function ($records): void {
                            foreach ($records as $record) {
                                $record->update(['is_active' => false]);
                            }
                        }),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Discount Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('code')
                            ->copyable()
                            ->weight('bold'),
                        Infolists\Components\TextEntry::make('name'),
                        Infolists\Components\TextEntry::make('description')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Infolists\Components\Section::make('Discount Settings')
                    ->schema([
                        Infolists\Components\TextEntry::make('type')
                            ->badge(),
                        Infolists\Components\TextEntry::make('formatted_value')
                            ->label('Value'),
                        Infolists\Components\TextEntry::make('minimum_amount')
                            ->money('SAR')
                            ->placeholder('No minimum'),
                        Infolists\Components\TextEntry::make('maximum_discount')
                            ->money('SAR')
                            ->placeholder('No maximum')
                            ->visible(fn (Discount $record): bool => $record->type === Discount::TYPE_PERCENTAGE),
                    ])
                    ->columns(2),

                Infolists\Components\Section::make('Usage Statistics')
                    ->schema([
                        Infolists\Components\TextEntry::make('usage_limit')
                            ->placeholder('Unlimited'),
                        Infolists\Components\TextEntry::make('usage_limit_per_customer')
                            ->placeholder('Unlimited'),
                        Infolists\Components\TextEntry::make('used_count'),
                        Infolists\Components\TextEntry::make('is_usage_limit_reached')
                            ->label('Usage Limit Reached')
                            ->badge()
                            ->color(fn (bool $state): string => $state ? 'danger' : 'success')
                            ->formatStateUsing(fn (bool $state): string => $state ? 'Yes' : 'No'),
                    ])
                    ->columns(2),

                Infolists\Components\Section::make('Validity')
                    ->schema([
                        Infolists\Components\TextEntry::make('is_active')
                            ->badge()
                            ->color(fn (bool $state): string => $state ? 'success' : 'danger')
                            ->formatStateUsing(fn (bool $state): string => $state ? 'Active' : 'Inactive'),
                        Infolists\Components\TextEntry::make('starts_at')
                            ->dateTime()
                            ->placeholder('Active immediately'),
                        Infolists\Components\TextEntry::make('expires_at')
                            ->dateTime()
                            ->placeholder('Never expires'),
                        Infolists\Components\TextEntry::make('is_valid')
                            ->label('Currently Valid')
                            ->badge()
                            ->color(fn (bool $state): string => $state ? 'success' : 'warning')
                            ->formatStateUsing(fn (bool $state): string => $state ? 'Valid' : 'Invalid'),
                    ])
                    ->columns(2),

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

    public static function getRelations(): array
    {
        return [
            RelationManagers\OrdersRelationManager::class,
            RelationManagers\UsagesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDiscounts::route('/'),
            'create' => Pages\CreateDiscount::route('/create'),
            'view' => Pages\ViewDiscount::route('/{record}'),
            'edit' => Pages\EditDiscount::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('expires_at', '<', now()->addDays(7))
            ->where('expires_at', '>', now())
            ->count();
    }
}
