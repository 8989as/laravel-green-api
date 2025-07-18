<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::active()->upcoming()->get();

        return response()->json([
            'events' => $events,
        ]);
    }

    public function show($id)
    {
        $event = Event::with('registrations')->findOrFail($id);

        return response()->json([
            'event' => $event,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'event_id' => 'required|integer|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'guests_count' => 'nullable|integer|min:1|max:10',
        ]);

        $registration = EventRegistration::create([
            'event_id' => $request->event_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'guests_count' => $request->guests_count ?? 1,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Event registration successful',
            'registration' => $registration,
        ]);
    }
}