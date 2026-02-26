<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\ApiToken;

class AuthTokenMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization', '');
        if (!str_starts_with($header, 'Bearer ')) {
            return response()->json(['message' => 'No autenticado'], 401);
        }
        $token = substr($header, 7);
        $record = ApiToken::with('user')->where('token', hash('sha256', $token))->first();
        if (!$record || ($record->expires_at && now()->gt($record->expires_at))) {
            return response()->json(['message' => 'Token inválido o expirado'], 401);
        }
        // Autenticar al usuario para el request
        auth()->setUser($record->user);
        // Adjuntar el registro del token para posibles revocaciones
        $request->attributes->set('api_token_record', $record);
        return $next($request);
    }
}
