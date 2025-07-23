<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ColorResource\Pages\CreateColor;
use App\Filament\Resources\ColorResource\Pages\EditColor;
use App\Filament\Resources\ColorResource\Pages\ListColors;
use App\Models\Color;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ColorResource extends Resource
{
    protected static ?string $model = Color::class;

    protected static ?string $navigationIcon = 'heroicon-o-swatch';

    protected static ?string $navigationGroup = 'Product Management';

    /**
     * Generate an SVG with the specified color using the template
     */
    public static function generateColoredSvg(string $hexColor): string
    {
        // Read the SVG template
        $templatePath = public_path('templates/color-template.svg');

        //         if (! file_exists($templatePath)) {
        //             // Fallback template if the file doesn't exist
        //             return <<<SVG
        // <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        //     <circle cx="12" cy="12" r="10" fill="{$hexColor}" stroke="#000000" stroke-width="1"/>
        // </svg>
        // SVG;
        //         }

        $template = file_get_contents($templatePath);

        // Replace the color placeholder with the actual hex code
        return str_replace('{{COLOR}}', $hexColor, $template);
    }

    /**
     * Store the SVG file and return the path
     */
    public static function storeColorSvg(string $svgContent, string $filename): string
    {
        // Store directly in public/colors directory
        $filePath = public_path("colors/{$filename}");

        // Create colors directory if it doesn't exist
        if (! is_dir(dirname($filePath))) {
            mkdir(dirname($filePath), 0755, true);
        }

        // Store the SVG file
        file_put_contents($filePath, $svgContent);

        // Return the public URL path
        return "colors/{$filename}";
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('color_en')
                    ->required()
                    ->maxLength(255)
                    ->label('Color Name (English)'),
                Forms\Components\TextInput::make('color_ar')
                    ->required()
                    ->maxLength(255)
                    ->label('Color Name (Arabic)'),
                Forms\Components\ColorPicker::make('hex_code')
                    ->required()
                    ->label('Color')
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (?string $state, Set $set, Forms\Get $get) {
                        if (! $state) {
                            return;
                        }

                        // Generate SVG with the selected color
                        $svgContent = self::generateColoredSvg($state);

                        // Create filename based on color name and hex code
                        $colorName = $get('color_en') ?: 'color';
                        $hexCode = str_replace('#', '', $state);
                        $filename = Str::slug($colorName).'-'.$hexCode.'.svg';

                        // Store the SVG file
                        $path = self::storeColorSvg($svgContent, $filename);

                        // Set the icon path
                        $set('icon', $path);
                    }),
                Forms\Components\Hidden::make('icon'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('color_en')
                    ->label('Color (English)')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('color_ar')
                    ->label('Color (Arabic)')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\ColorColumn::make('hex_code')
                    ->label('Color')
                    ->sortable(),
                Tables\Columns\ImageColumn::make('icon')
                    ->label('Icon Preview')
                    ->size(40),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateActions([
                Tables\Actions\CreateAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListColors::route('/'),
            'create' => CreateColor::route('/create'),
            'edit' => EditColor::route('/{record}/edit'),
        ];
    }
}
