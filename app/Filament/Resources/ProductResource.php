<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('category_id')
                    ->label('Category')
                    ->relationship('category', 'category_en')
                    ->searchable()
                    ->required(),
                Forms\Components\TextInput::make('name_ar')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('name_en')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('name_latin')
                    ->maxLength(255),
                Forms\Components\Textarea::make('description_ar')
                    ->columnSpanFull(),
                Forms\Components\Textarea::make('description_en')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                Forms\Components\TextInput::make('discount_price')
                    ->numeric(),
                Forms\Components\DatePicker::make('discount_from'),
                Forms\Components\DatePicker::make('discount_to'),
                Forms\Components\Toggle::make('has_variants')
                    ->required()
                    ->reactive(),
                Forms\Components\TextInput::make('stock')
                    ->numeric()
                    ->visible(fn ($get) => !$get('has_variants')),
                Forms\Components\Repeater::make('attributes')
                    ->label('Product Variants')
                    ->relationship('attributes')
                    ->schema([
                        Forms\Components\Select::make('color_id')
                            ->label('Color')
                            ->relationship('color', 'color_en')
                            ->searchable()
                            ->required(),
                        Forms\Components\Select::make('size_id')
                            ->label('Size')
                            ->relationship('size', 'size_en')
                            ->searchable()
                            ->required(),
                        Forms\Components\TextInput::make('stock')
                            ->numeric()
                            ->required(),
                        Forms\Components\TextInput::make('sku')
                            ->maxLength(64),
                        Forms\Components\Toggle::make('is_default')
                            ->label('Default Variant'),
                    ])
                    ->visible(fn ($get) => $get('has_variants')),
                Forms\Components\Section::make('Product Images')
                    ->description('Upload main product image and gallery images')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('main_image')
                            ->label('Main Image')
                            ->collection('products')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '1:1',
                                '4:3',
                                '16:9',
                            ])
                            ->required()
                            ->maxFiles(1)
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
                            ->maxSize(5120) // 5MB
                            ->downloadable()
                            ->previewable()
                            ->deletable()
                            ->reorderable(false)
                            ->helperText('Upload the main product image. This will be displayed as the primary image.')
                            ->validationMessages([
                                'required' => 'A main product image is required.',
                                'max' => 'The image must not be larger than 5MB.',
                            ]),
                        SpatieMediaLibraryFileUpload::make('gallery_images')
                            ->label('Gallery Images')
                            ->collection('gallery')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '1:1',
                                '4:3',
                                '16:9',
                            ])
                            ->multiple()
                            ->maxFiles(10)
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
                            ->maxSize(5120) // 5MB
                            ->downloadable()
                            ->previewable()
                            ->deletable()
                            ->reorderable()
                            ->helperText('Upload additional product images (up to 10). These will be displayed in the product gallery.')
                            ->validationMessages([
                                'max' => 'Each image must not be larger than 5MB.',
                            ]),
                    ])
                    ->columnSpanFull(),
                Forms\Components\Toggle::make('is_active')
                    ->required(),
                Forms\Components\Toggle::make('in_stock')
                    ->required(),
                Forms\Components\Toggle::make('is_gift')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\SpatieMediaLibraryImageColumn::make('main_image')
                    ->label('Image')
                    ->collection('products')
                    ->width(60)
                    ->height(60)
                    ->circular(),
                Tables\Columns\TextColumn::make('name_ar')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name_en')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name_latin')
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->money()
                    ->sortable(),
                Tables\Columns\TextColumn::make('discount_price')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('discount_from')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('discount_to')
                    ->date()
                    ->sortable(),
                Tables\Columns\IconColumn::make('has_variants')
                    ->boolean(),
                Tables\Columns\TextColumn::make('stock')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\IconColumn::make('in_stock')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_gift')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ColorRelationManager::class,
            RelationManagers\SizeRelationManager::class,
            RelationManagers\CategoryRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
