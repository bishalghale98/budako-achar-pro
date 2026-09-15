<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetXsrfCookieDomain
{
    /**
     * Ensure the XSRF-TOKEN cookie is accessible across subdomains.
     *
     * When the frontend and API are on different subdomains of the same parent,
     * the XSRF-TOKEN cookie set by Sanctum on the API domain is not readable
     * by JavaScript on the frontend domain. This middleware re-sets the cookie
     * with the parent domain so both subdomains can access it.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $cookieDomain = $this->getParentDomain();

        if ($cookieDomain) {
            $cookies = $response->headers->getSetCookie();

            if (! is_array($cookies)) {
                $cookies = $cookies ? [$cookies] : [];
            }

            foreach ($cookies as $index => $cookie) {
                if (str_starts_with($cookie, 'XSRF-TOKEN=')) {
                    // Remove any existing Domain attribute
                    $cookie = preg_replace('/;\s*Domain=[^;]*/i', '', $cookie);
                    // Add the parent domain
                    $cookies[$index] = $cookie . '; Domain=' . $cookieDomain;
                }
            }

            $response->headers->remove('Set-Cookie');
            foreach ($cookies as $cookie) {
                $response->headers->append('Set-Cookie', $cookie);
            }
        }

        return $response;
    }

    private function getParentDomain(): ?string
    {
        $host = request()->getHost();

        // Match patterns like subdomain.domain.tld → domain.tld
        if (preg_match('/^[^.]+\.[^.]+\.[^.]+$/', $host)) {
            return preg_replace('/^[^.]+\./', '', $host);
        }

        return null;
    }
}
