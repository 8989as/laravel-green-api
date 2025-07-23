<?php

namespace App\Filament\Resources\ColorResource\Pages;

use App\Filament\Resources\ColorResource;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Str;

class EditColor extends EditRecord
{
    protected static string $resource = ColorResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // If the icon hasn't been set through the color picker, generate it
        if (empty($data['icon']) && ! empty($data['hex_code'])) {
            $svgContent = ColorResource::generateColoredSvg($data['hex_code']);
            $colorName = $data['color_en'] ?: 'color';
            $hexCode = str_replace('#', '', $data['hex_code']);
            $filename = Str::slug($colorName).'-'.$hexCode.'.svg';
            $data['icon'] = ColorResource::storeColorSvg($svgContent, $filename);
        }

        return $data;
    }
}
