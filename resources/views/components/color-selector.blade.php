@props(['colors', 'selected' => null])

<div class="color-selector flex flex-wrap gap-2">
    @foreach($colors as $color)
        <div class="color-option relative">
            <input 
                type="radio" 
                name="color" 
                value="{{ $color->id }}" 
                id="color-{{ $color->id }}"
                class="sr-only peer"
                @if($selected == $color->id) checked @endif
            >
            <label 
                for="color-{{ $color->id }}" 
                class="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200 transition-all"
                title="{{ $color->localized_name }}"
            >
                @if($color->icon)
                    <img src="{{ $color->icon_url }}" alt="{{ $color->localized_name }}" class="w-8 h-8">
                @else
                    <div 
                        class="w-8 h-8 rounded-full border border-gray-300" 
                        style="background-color: {{ $color->hex_code }}"
                    ></div>
                @endif
            </label>
            <span class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                {{ $color->localized_name }}
            </span>
        </div>
    @endforeach
</div>