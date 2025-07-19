<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProductMediaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    /** @test */
    public function it_can_register_media_collections()
    {
        $product = Product::factory()->create();
        
        // Test that collections are registered
        $collections = $product->getMediaCollections();
        
        $this->assertCount(2, $collections);
        $this->assertTrue($collections->contains('name', 'products'));
        $this->assertTrue($collections->contains('name', 'gallery'));
    }

    /** @test */
    public function it_can_add_main_image_to_products_collection()
    {
        $product = Product::factory()->create();
        $file = UploadedFile::fake()->image('main-image.jpg', 800, 600);
        
        $media = $product->addMediaFromRequest('file')
            ->toMediaCollection('products');
            
        $this->assertInstanceOf(Media::class, $media);
        $this->assertEquals('products', $media->collection_name);
        $this->assertEquals('main-image.jpg', $media->name);
    }

    /** @test */
    public function it_can_add_gallery_images()
    {
        $product = Product::factory()->create();
        $file1 = UploadedFile::fake()->image('gallery-1.jpg', 800, 600);
        $file2 = UploadedFile::fake()->image('gallery-2.jpg', 800, 600);
        
        $product->addMedia($file1)->toMediaCollection('gallery');
        $product->addMedia($file2)->toMediaCollection('gallery');
        
        $galleryMedia = $product->getMedia('gallery');
        $this->assertCount(2, $galleryMedia);
    }

    /** @test */
    public function it_generates_media_conversions()
    {
        $product = Product::factory()->create();
        $file = UploadedFile::fake()->image('test-image.jpg', 1200, 1200);
        
        $media = $product->addMedia($file)->toMediaCollection('products');
        
        // Check that conversions are registered
        $conversions = $media->getMediaConversions();
        $conversionNames = $conversions->pluck('name')->toArray();
        
        $this->assertContains('thumb', $conversionNames);
        $this->assertContains('medium', $conversionNames);
    }

    /** @test */
    public function it_returns_main_image_url()
    {
        $product = Product::factory()->create();
        $file = UploadedFile::fake()->image('main-image.jpg', 800, 600);
        
        $product->addMedia($file)->toMediaCollection('products');
        
        $mainImageUrl = $product->main_image;
        $this->assertNotNull($mainImageUrl);
        $this->assertStringContains('main-image.jpg', $mainImageUrl);
    }

    /** @test */
    public function it_returns_gallery_images_array()
    {
        $product = Product::factory()->create();
        $file1 = UploadedFile::fake()->image('gallery-1.jpg', 800, 600);
        $file2 = UploadedFile::fake()->image('gallery-2.jpg', 800, 600);
        
        $product->addMedia($file1)->toMediaCollection('gallery');
        $product->addMedia($file2)->toMediaCollection('gallery');
        
        $galleryImages = $product->gallery_images;
        
        $this->assertIsArray($galleryImages);
        $this->assertCount(2, $galleryImages);
        $this->assertArrayHasKey('id', $galleryImages[0]);
        $this->assertArrayHasKey('url', $galleryImages[0]);
        $this->assertArrayHasKey('name', $galleryImages[0]);
        $this->assertArrayHasKey('size', $galleryImages[0]);
    }

    /** @test */
    public function it_returns_all_images_with_type()
    {
        $product = Product::factory()->create();
        $mainFile = UploadedFile::fake()->image('main.jpg', 800, 600);
        $galleryFile = UploadedFile::fake()->image('gallery.jpg', 800, 600);
        
        $product->addMedia($mainFile)->toMediaCollection('products');
        $product->addMedia($galleryFile)->toMediaCollection('gallery');
        
        $allImages = $product->all_images;
        
        $this->assertIsArray($allImages);
        $this->assertCount(2, $allImages);
        
        // Check main image
        $mainImage = collect($allImages)->firstWhere('type', 'main');
        $this->assertNotNull($mainImage);
        $this->assertEquals('main', $mainImage['type']);
        
        // Check gallery image
        $galleryImage = collect($allImages)->firstWhere('type', 'gallery');
        $this->assertNotNull($galleryImage);
        $this->assertEquals('gallery', $galleryImage['type']);
    }

    /** @test */
    public function it_handles_missing_images_gracefully()
    {
        $product = Product::factory()->create();
        
        $this->assertNull($product->main_image);
        $this->assertEmpty($product->gallery_images);
        $this->assertEmpty($product->all_images);
    }
}