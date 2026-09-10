<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Session::start();
    }

    private function asUser(User $user): self
    {
        $this->actingAs($user, 'sanctum');
        return $this;
    }

    // ─── Registration ────────────────────────────────────

    public function test_register_succeeds(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'user' => ['id', 'name', 'email'],
            ]);

        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_register_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Duplicate',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_rejects_missing_fields(): void
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_register_rejects_mismatched_password(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    // ─── Login ───────────────────────────────────────────

    public function test_login_succeeds(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'message',
                'user' => ['id', 'name', 'email'],
            ]);
    }

    public function test_login_rejects_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_rejects_nonexistent_user(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nobody@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_rejects_missing_fields(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    // ─── Me ──────────────────────────────────────────────

    public function test_me_requires_authentication(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }

    public function test_me_returns_current_user(): void
    {
        $user = User::factory()->create();

        $response = $this->asUser($user)->getJson('/api/me');

        $response->assertOk()
            ->assertJsonFragment([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);
    }

    // ─── Logout ──────────────────────────────────────────

    public function test_logout_succeeds(): void
    {
        $user = User::factory()->create();

        $response = $this->asUser($user)->postJson('/api/logout');

        $response->assertOk()
            ->assertJsonStructure(['success', 'message']);
    }

    // ─── Change Password ─────────────────────────────────

    public function test_change_password_succeeds(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('oldpassword'),
        ]);

        $response = $this->asUser($user)->postJson('/api/change-password', [
            'current_password' => 'oldpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['success', 'message']);

        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));
    }

    public function test_change_password_rejects_wrong_current_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('oldpassword'),
        ]);

        $response = $this->asUser($user)->postJson('/api/change-password', [
            'current_password' => 'wrongpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422);
    }

    public function test_change_password_rejects_same_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('samepassword'),
        ]);

        $response = $this->asUser($user)->postJson('/api/change-password', [
            'current_password' => 'samepassword',
            'password' => 'samepassword',
            'password_confirmation' => 'samepassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    // ─── Forgot Password ─────────────────────────────────

    public function test_forgot_password_succeeds(): void
    {
        User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['success', 'message']);
    }

    public function test_forgot_password_does_not_reveal_email_existence(): void
    {
        $responseExisting = $this->postJson('/api/forgot-password', [
            'email' => 'existing@example.com',
        ]);

        $responseNonExisting = $this->postJson('/api/forgot-password', [
            'email' => 'doesnotexist@example.com',
        ]);

        $responseExisting->assertOk();
        $responseNonExisting->assertOk();

        $this->assertEquals(
            $responseExisting->json('message'),
            $responseNonExisting->json('message')
        );
    }

    public function test_forgot_password_rejects_invalid_email(): void
    {
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    // ─── Reset Password ──────────────────────────────────

    public function test_reset_password_succeeds(): void
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        $token = \Illuminate\Support\Facades\Password::createToken($user);

        $response = $this->postJson('/api/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['success', 'message']);

        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));
    }

    public function test_reset_password_rejects_invalid_token(): void
    {
        $response = $this->postJson('/api/reset-password', [
            'token' => 'invalid-token',
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422);
    }

    // ─── Logout All ──────────────────────────────────────

    public function test_logout_all_succeeds(): void
    {
        $user = User::factory()->create();

        $response = $this->asUser($user)->postJson('/api/logout-all');

        $response->assertOk()
            ->assertJsonStructure(['success', 'message']);
    }

    // ─── Profile ─────────────────────────────────────────

    public function test_get_profile_succeeds(): void
    {
        $user = User::factory()->create();

        $response = $this->asUser($user)->getJson('/api/user/profile');

        $response->assertOk()
            ->assertJsonFragment([
                'name' => $user->name,
                'email' => $user->email,
            ]);
    }

    public function test_update_profile_succeeds(): void
    {
        $user = User::factory()->create();

        $response = $this->asUser($user)->patchJson('/api/user/profile', [
            'name' => 'Updated Name',
            'email' => $user->email,
        ]);

        $response->assertOk()
            ->assertJsonStructure(['success', 'message', 'user']);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_update_profile_rejects_duplicate_email(): void
    {
        $user = User::factory()->create();
        User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->asUser($user)->patchJson('/api/user/profile', [
            'name' => $user->name,
            'email' => 'taken@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    // ─── Email Verification ──────────────────────────────

    public function test_send_verification_email(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $response = $this->asUser($user)->postJson('/api/email/verification-notification');

        $response->assertOk();
    }

    public function test_already_verified_returns_message(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->asUser($user)->postJson('/api/email/verification-notification');

        $response->assertOk()
            ->assertJsonFragment(['message' => 'Email is already verified.']);
    }

    // ─── Unauthenticated ─────────────────────────────────

    public function test_unauthenticated_returns_401(): void
    {
        $endpoints = [
            ['GET', '/api/me'],
            ['POST', '/api/logout'],
            ['POST', '/api/logout-all'],
            ['POST', '/api/change-password'],
            ['GET', '/api/user/profile'],
            ['PATCH', '/api/user/profile'],
            ['POST', '/api/email/verification-notification'],
        ];

        foreach ($endpoints as [$method, $url]) {
            $response = $this->json($method, $url);
            $response->assertStatus(401);
        }
    }
}
