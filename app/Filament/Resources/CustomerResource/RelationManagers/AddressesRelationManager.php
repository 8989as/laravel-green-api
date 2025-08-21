<?php

namespace App\Filament\Resources\CustomerResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class AddressesRelationManager extends RelationManager
{
    protected static string $relationship = 'addresses';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('address_type')
                    ->options([
                        'home' => 'Home',
                        'work' => 'Work',
                        'other' => 'Other',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('city')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('area')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('address_details')
                    ->required()
                    ->maxLength(500),
                Forms\Components\TextInput::make('builing_number')
                    ->label('Building Number')
                    ->maxLength(255),
                Forms\Components\TextInput::make('floor_number')
                    ->label('Floor Number')
                    ->maxLength(255),
                Forms\Components\TextInput::make('apartment_number')
                    ->label('Apartment Number')
                    ->maxLength(255),
                Forms\Components\Textarea::make('notes')
                    ->maxLength(500),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('address_details')
            ->columns([
                Tables\Columns\TextColumn::make('address_type')
                    ->badge(),
                Tables\Columns\TextColumn::make('city'),
                Tables\Columns\TextColumn::make('area'),
                Tables\Columns\TextColumn::make('address_details')
                    ->limit(50),
                Tables\Columns\TextColumn::make('builing_number')
                    ->label('Building'),
                Tables\Columns\TextColumn::make('full_address')
                    ->label('Full Address')
                    ->limit(100)
                    ->toggleable(isToggledHiddenByDefault: true),
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
