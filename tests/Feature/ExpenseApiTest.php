<?php

namespace Tests\Feature;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_list_expenses(): void
    {
        $response = $this->getJson('/api/expenses');

        $response->assertStatus(401);
    }

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);
    }

    public function test_registration_fails_with_mismatched_passwords(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different456',
        ]);

        $response->assertStatus(422);
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create(['password' => bcrypt('password123')]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create(['password' => bcrypt('password123')]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422);
    }

    public function test_authenticated_user_only_sees_their_own_expenses(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        Expense::factory()->for($userA)->create();
        Expense::factory()->for($userB)->count(2)->create();

        $response = $this->actingAs($userA, 'sanctum')->getJson('/api/expenses');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_user_can_create_an_expense(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/expenses', [
            'date' => '2026-08-20',
            'cost' => 1500.00,
            'description' => 'Bus ticket to Colombo',
            'expense_type' => 'travel',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.description', 'Bus ticket to Colombo');

        $this->assertDatabaseHas('expenses', [
            'user_id' => $user->id,
            'description' => 'Bus ticket to Colombo',
        ]);
    }

    public function test_expense_creation_fails_with_negative_cost(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/expenses', [
            'date' => '2026-08-20',
            'cost' => -50,
            'description' => 'Invalid expense',
            'expense_type' => 'travel',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('cost');
    }

    public function test_expense_creation_fails_with_invalid_expense_type(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/expenses', [
            'date' => '2026-08-20',
            'cost' => 500,
            'description' => 'Some expense',
            'expense_type' => 'not-a-real-type',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('expense_type');
    }

    public function test_owner_can_view_their_own_expense(): void
    {
        $user = User::factory()->create();
        $expense = Expense::factory()->for($user)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/expenses/{$expense->id}");

        $response->assertStatus(200)->assertJsonPath('data.id', $expense->id);
    }

    public function test_user_cannot_view_someone_elses_expense(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $expense = Expense::factory()->for($owner)->create();

        $response = $this->actingAs($otherUser, 'sanctum')->getJson("/api/expenses/{$expense->id}");

        $response->assertStatus(403);
    }

    public function test_viewing_a_nonexistent_expense_returns_404(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/expenses/9999');

        $response->assertStatus(404);
    }

    public function test_owner_can_update_their_own_expense(): void
    {
        $user = User::factory()->create();
        $expense = Expense::factory()->for($user)->create(['description' => 'Old description']);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/expenses/{$expense->id}", [
            'date' => '2026-08-21',
            'cost' => 2000.00,
            'description' => 'Updated description',
            'expense_type' => 'food',
        ]);

        $response->assertStatus(200)->assertJsonPath('data.description', 'Updated description');
    }

    public function test_user_cannot_update_someone_elses_expense(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $expense = Expense::factory()->for($owner)->create();

        $response = $this->actingAs($otherUser, 'sanctum')->putJson("/api/expenses/{$expense->id}", [
            'date' => '2026-08-21',
            'cost' => 2000.00,
            'description' => 'Hacked description',
            'expense_type' => 'food',
        ]);

        $response->assertStatus(403);

        $this->assertDatabaseMissing('expenses', [
            'id' => $expense->id,
            'description' => 'Hacked description',
        ]);
    }

    public function test_owner_can_delete_their_own_expense(): void
    {
        $user = User::factory()->create();
        $expense = Expense::factory()->for($user)->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/expenses/{$expense->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }

    public function test_user_cannot_delete_someone_elses_expense(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $expense = Expense::factory()->for($owner)->create();

        $response = $this->actingAs($otherUser, 'sanctum')->deleteJson("/api/expenses/{$expense->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('expenses', ['id' => $expense->id]);
    }
}