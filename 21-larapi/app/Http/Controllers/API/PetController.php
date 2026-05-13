<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pet;
use Illuminate\Support\Facades\File;

class PetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pets = Pet::all();

        if ($pets->isEmpty()) {
            return response()->json([
                'error' => 'No pets found 🐾'
            ], 404);
        }

        return response()->json([
            'message' => 'Successful Query 🐈',
            'pets' => $pets
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => ['required', 'string'],
                'kind' => ['required', 'string'],
                'weight' => ['required', 'numeric'],
                'age' => ['required', 'integer'],
                'breed' => ['required', 'string'],
                'location' => ['required', 'string'],
                'description' => ['required', 'string'],
                'owner_id' => ['nullable', 'integer'],
                'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048']
            ]);

            $imageName = 'no-photo.png';
            if ($request->hasFile('image')) {
                $imageName = time() . '.' . $request->image->extension();
                $request->image->move(public_path('images'), $imageName);
            }

            $pet = Pet::create([
                'name' => $request->name,
                'kind' => $request->kind,
                'weight' => $request->weight,
                'age' => $request->age,
                'breed' => $request->breed,
                'location' => $request->location,
                'description' => $request->description,
                'status' => 'active',
                'owner_id' => $request->owner_id,
                'image' => $imageName,
            ]);

            return response()->json([
                'message' => 'Pet was successfully added!',
                'pet' => $pet
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error in the request',
                'errors' => $e->errors()
            ], 422); // Error de validación estándar
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pet = Pet::find($id);
        if ($pet) {
            return response()->json([
                'message' => 'Successful Query 🐕',
                'pet' => $pet
            ], 200);
        }

        return response()->json([
            'error' => 'Pet not found 🐾'
        ], 404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pet = Pet::find($id);

        if (!$pet) {
            return response()->json(['error' => 'Pet not found 🐾'], 404);
        }

        // CORRECCIÓN: 'originimage' ahora es 'nullable' para evitar el error 422
        $request->validate([
            'name' => ['sometimes', 'string'],
            'kind' => ['sometimes', 'string'],
            'weight' => ['sometimes', 'numeric'],
            'age' => ['sometimes', 'integer'],
            'breed' => ['sometimes', 'string'],
            'location' => ['sometimes', 'string'],
            'description' => ['sometimes', 'string'],
            'image' => ['sometimes', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'originimage' => ['nullable'],
        ]);

        // Manejo de la imagen
        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images'), $imageName);

            // Determinar qué imagen borrar (la que viene en originimage o la que tiene el modelo)
            $oldImage = $request->input('originimage') ?? $pet->image;

            if ($oldImage && !in_array($oldImage, ['no-photo.png', 'no-photo.svg'])) {
                $oldPath = public_path('images/' . $oldImage);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
            $pet->image = $imageName;
        }

        // Actualización de campos restantes
        $updatable = ['name', 'kind', 'weight', 'age', 'breed', 'location', 'description'];
        foreach ($updatable as $field) {
            if ($request->has($field)) {
                $pet->{$field} = $request->input($field);
            }
        }

        $pet->save();

        return response()->json([
            'message' => 'Pet updated successfully! ✨',
            'pet' => $pet
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $pet = Pet::find($id);

        if ($pet) {
            // Opcional: Borrar la imagen física al eliminar la mascota
            if ($pet->image && !in_array($pet->image, ['no-photo.png', 'no-photo.svg'])) {
                $path = public_path('images/' . $pet->image);
                if (file_exists($path)) {
                    @unlink($path);
                }
            }

            $pet->delete();
            return response()->json([
                'message' => 'Pet was successfully deleted!',
                'pet' => $pet
            ], 200);
        }

        return response()->json(['error' => 'Pet not found 🐾'], 404);
    }
}