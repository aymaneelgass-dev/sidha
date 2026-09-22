<?php

namespace Database\Seeders;

use App\Enums\ClientStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Client;
use App\Models\ClientContact;
use App\Models\User;
use Illuminate\Database\Seeder;
use LogicException;

class SidhaDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction()) {
            throw new LogicException('SIDHA demo data cannot be seeded in production.');
        }

        $this->seedTeam();
        $this->seedClients();
    }

    private function seedTeam(): void
    {
        $members = [
            [
                'name' => 'Amina Demo',
                'email' => 'admin@sidha.test',
                'job_title' => 'Studio Director',
                'phone' => '+212 555 0101',
                'role' => UserRole::Admin,
                'status' => UserStatus::Active,
            ],
            [
                'name' => 'Youssef Demo',
                'email' => 'producer@sidha.test',
                'job_title' => 'Producer',
                'phone' => '+212 555 0102',
                'role' => UserRole::Member,
                'status' => UserStatus::Active,
            ],
            [
                'name' => 'Salma Demo',
                'email' => 'editor@sidha.test',
                'job_title' => 'Video Editor',
                'phone' => '+212 555 0103',
                'role' => UserRole::Member,
                'status' => UserStatus::Active,
            ],
            [
                'name' => 'Omar Demo',
                'email' => 'alumni@sidha.test',
                'job_title' => 'Former Coordinator',
                'phone' => '+212 555 0104',
                'role' => UserRole::Member,
                'status' => UserStatus::Suspended,
            ],
        ];

        foreach ($members as $member) {
            User::factory()->create([
                ...$member,
                'email_verified_at' => now(),
            ]);
        }
    }

    private function seedClients(): void
    {
        $clients = [
            [
                'name' => 'Atlas Lantern Films (Demo)',
                'industry' => 'Audiovisual production',
                'phone' => '+212 555 1001',
                'website' => 'https://atlas-lantern.test',
                'address' => '11 Fiction Avenue, Casablanca',
                'notes' => 'Demo client for a documentary production.',
                'status' => ClientStatus::Active,
                'contacts' => [
                    ['name' => 'Noor Atlas (Demo)', 'job_title' => 'Executive Producer', 'email' => 'noor@atlas-lantern.test', 'phone' => '+212 555 2001', 'is_primary' => true],
                    ['name' => 'Rami Atlas (Demo)', 'job_title' => 'Production Coordinator', 'email' => 'rami@atlas-lantern.test', 'phone' => '+212 555 2002', 'is_primary' => false],
                ],
            ],
            [
                'name' => 'Blue Dune Audio (Demo)',
                'industry' => 'Audio production',
                'phone' => '+212 555 1002',
                'website' => 'https://blue-dune.test',
                'address' => '22 Fiction Avenue, Rabat',
                'notes' => 'Demo client for sound design and recording.',
                'status' => ClientStatus::Active,
                'contacts' => [
                    ['name' => 'Lina Dune (Demo)', 'job_title' => 'Creative Director', 'email' => 'lina@blue-dune.test', 'phone' => '+212 555 2003', 'is_primary' => true],
                    ['name' => 'Ilyas Dune (Demo)', 'job_title' => 'Sound Engineer', 'email' => 'ilyas@blue-dune.test', 'phone' => '+212 555 2004', 'is_primary' => false],
                ],
            ],
            [
                'name' => 'Cedar Frame Studio (Demo)',
                'industry' => 'Photography',
                'phone' => '+212 555 1003',
                'website' => 'https://cedar-frame.test',
                'address' => '33 Fiction Avenue, Tangier',
                'notes' => 'Demo client for an editorial photography campaign.',
                'status' => ClientStatus::Active,
                'contacts' => [
                    ['name' => 'Maya Cedar (Demo)', 'job_title' => 'Art Director', 'email' => 'maya@cedar-frame.test', 'phone' => '+212 555 2005', 'is_primary' => true],
                ],
            ],
            [
                'name' => 'Moonlit Kasbah Media (Demo)',
                'industry' => 'Digital media',
                'phone' => '+212 555 1004',
                'website' => 'https://moonlit-kasbah.test',
                'address' => '44 Fiction Avenue, Marrakesh',
                'notes' => 'Demo client for a multilingual social campaign.',
                'status' => ClientStatus::Active,
                'contacts' => [
                    ['name' => 'Sami Moon (Demo)', 'job_title' => 'Campaign Manager', 'email' => 'sami@moonlit-kasbah.test', 'phone' => '+212 555 2006', 'is_primary' => true],
                    ['name' => 'Hana Moon (Demo)', 'job_title' => 'Content Strategist', 'email' => 'hana@moonlit-kasbah.test', 'phone' => '+212 555 2007', 'is_primary' => false],
                    ['name' => 'Adam Moon (Demo)', 'job_title' => 'Designer', 'email' => 'adam@moonlit-kasbah.test', 'phone' => '+212 555 2008', 'is_primary' => false],
                ],
            ],
            [
                'name' => 'Paper Kite Learning (Demo)',
                'industry' => 'Education',
                'phone' => '+212 555 1005',
                'website' => 'https://paper-kite.test',
                'address' => '55 Fiction Avenue, Fez',
                'notes' => 'Demo client for a training video series.',
                'status' => ClientStatus::Inactive,
                'contacts' => [
                    ['name' => 'Imane Kite (Demo)', 'job_title' => 'Learning Lead', 'email' => 'imane@paper-kite.test', 'phone' => '+212 555 2009', 'is_primary' => true],
                    ['name' => 'Nabil Kite (Demo)', 'job_title' => 'Program Coordinator', 'email' => 'nabil@paper-kite.test', 'phone' => '+212 555 2010', 'is_primary' => false],
                ],
            ],
            [
                'name' => 'Pixel Caravan Labs (Demo)',
                'industry' => 'Technology',
                'phone' => '+212 555 1006',
                'website' => 'https://pixel-caravan.test',
                'address' => '66 Fiction Avenue, Agadir',
                'notes' => 'Demo client for a product launch film.',
                'status' => ClientStatus::Inactive,
                'contacts' => [
                    ['name' => 'Aya Pixel (Demo)', 'job_title' => 'Product Marketer', 'email' => 'aya@pixel-caravan.test', 'phone' => '+212 555 2011', 'is_primary' => true],
                ],
            ],
            [
                'name' => 'Silver Palm Events (Demo)',
                'industry' => 'Events',
                'phone' => '+212 555 1007',
                'website' => 'https://silver-palm.test',
                'address' => '77 Fiction Avenue, Essaouira',
                'notes' => 'Archived demo client retained for historical context.',
                'status' => ClientStatus::Archived,
                'contacts' => [
                    ['name' => 'Sara Palm (Demo)', 'job_title' => 'Event Director', 'email' => 'sara@silver-palm.test', 'phone' => '+212 555 2012', 'is_primary' => true],
                    ['name' => 'Mehdi Palm (Demo)', 'job_title' => 'Event Producer', 'email' => 'mehdi@silver-palm.test', 'phone' => '+212 555 2013', 'is_primary' => false],
                ],
            ],
            [
                'name' => 'Sunrise Reel House (Demo)',
                'industry' => 'Film distribution',
                'phone' => '+212 555 1008',
                'website' => 'https://sunrise-reel.test',
                'address' => '88 Fiction Avenue, Ouarzazate',
                'notes' => 'Archived demo client with no designated primary contact.',
                'status' => ClientStatus::Archived,
                'contacts' => [
                    ['name' => 'Leila Reel (Demo)', 'job_title' => 'Distribution Manager', 'email' => 'leila@sunrise-reel.test', 'phone' => '+212 555 2014', 'is_primary' => false],
                    ['name' => 'Karim Reel (Demo)', 'job_title' => 'Sales Coordinator', 'email' => 'karim@sunrise-reel.test', 'phone' => '+212 555 2015', 'is_primary' => false],
                    ['name' => 'Zahra Reel (Demo)', 'job_title' => 'Festival Coordinator', 'email' => 'zahra@sunrise-reel.test', 'phone' => '+212 555 2016', 'is_primary' => false],
                ],
            ],
        ];

        foreach ($clients as $clientData) {
            $contacts = $clientData['contacts'];
            unset($clientData['contacts']);

            $client = Client::factory()->create($clientData);

            foreach ($contacts as $contact) {
                ClientContact::factory()->for($client)->create($contact);
            }
        }
    }
}
