<?php
declare(strict_types=1);

namespace App\Controller;

use Cake\Http\Response;

class DesignAssistantController extends AppController
{
    /**
     * Convert a free-text prompt into a property configuration.
     *
     * This local rule engine keeps the prototype working without exposing
     * third-party API keys from the browser. A server-side LLM proxy can
     * replace it later without changing the frontend contract.
     *
     * @return \Cake\Http\Response
     */
    public function analyze(): Response
    {
        $this->request->allowMethod(['post']);

        $payload = $this->request->input('json_decode', true);
        $prompt = trim((string)($payload['prompt'] ?? ''));

        if ($prompt === '') {
            return $this->jsonResponse([
                'error' => 'Prompt is required.',
            ], 422);
        }

        $normalized = mb_strtolower($prompt);
        $config = [
            'house' => $this->resolveHouse($normalized),
            'roof' => $this->resolveRoof($normalized),
            'garden' => $this->resolveGarden($normalized),
            'mood' => $this->resolveMood($normalized),
        ];

        return $this->jsonResponse([
            'desc' => $this->buildDescription($config),
            'blender' => $this->buildBlenderPrompt($config),
            'tags' => array_values(array_unique([
                $config['house'],
                $config['roof'],
                $config['mood'],
                ...$config['garden'],
            ])),
            'config' => $config,
            'source' => 'local-rule-engine',
        ]);
    }

    /**
     * @param array<string, mixed> $payload
     * @param int $status
     * @return \Cake\Http\Response
     */
    private function jsonResponse(array $payload, int $status = 200): Response
    {
        return $this->response
            ->withStatus($status)
            ->withType('application/json')
            ->withStringBody((string)json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    private function resolveHouse(string $prompt): string
    {
        if ($this->containsAny($prompt, ['bois', 'wood', 'timber', 'eco', 'écologique', 'ecologique', 'naturel'])) {
            return 'bois';
        }
        if ($this->containsAny($prompt, ['bungalow', 'plain-pied', 'single-storey', 'single story', 'minimaliste'])) {
            return 'bungalow';
        }
        if ($this->containsAny($prompt, ['français', 'francais', 'normand', 'traditionnel', 'traditional', 'maison de campagne'])) {
            return 'normand';
        }

        return 'moderne';
    }

    private function resolveRoof(string $prompt): string
    {
        if ($this->containsAny($prompt, ['plat', 'flat roof', 'toit-terrasse', 'roof terrace'])) {
            return 'plat';
        }
        if ($this->containsAny($prompt, ['zinc', 'metal roof', 'métal', 'metal'])) {
            return 'zinc';
        }
        if ($this->containsAny($prompt, ['pentes', 'gable', 'saddle', 'saddeltag', 'pitched'])) {
            return 'pentes';
        }

        return 'tuile';
    }

    /**
     * @return list<string>
     */
    private function resolveGarden(string $prompt): array
    {
        $choices = [
            'lavande' => ['lavande', 'lavender'],
            'oliviers' => ['olivier', 'oliviers', 'olive tree', 'olive trees'],
            'piscine' => ['piscine', 'pool', 'swimming pool'],
            'haie' => ['haie', 'hedge', 'hæk'],
            'terrasse' => ['terrasse', 'deck', 'terrace'],
            'pergola' => ['pergola'],
            'bassin' => ['bassin', 'pond', 'water feature'],
            'prairie' => ['prairie', 'meadow', 'wild garden', 'nature ground', 'naturgrund'],
        ];

        $garden = [];
        foreach ($choices as $key => $keywords) {
            if ($this->containsAny($prompt, $keywords)) {
                $garden[] = $key;
            }
        }

        if ($garden === []) {
            $garden = ['lavande', 'terrasse'];
        }

        return $garden;
    }

    private function resolveMood(string $prompt): string
    {
        if ($this->containsAny($prompt, ['vacances', 'summer', 'holiday', 'sommerhus'])) {
            return 'vacances';
        }
        if ($this->containsAny($prompt, ['architecte', 'architecture', 'contemporain', 'prestige', 'design', 'moderne arkitektur'])) {
            return 'archi';
        }
        if ($this->containsAny($prompt, ['nature', 'écologie', 'ecologie', 'permaculture', 'landscape', 'retour à la nature'])) {
            return 'nature';
        }

        return 'famille';
    }

    /**
     * @param list<string> $needles
     * @return bool
     */
    private function containsAny(string $haystack, array $needles): bool
    {
        foreach ($needles as $needle) {
            if (str_contains($haystack, $needle)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param array{house:string,roof:string,garden:list<string>,mood:string} $config
     * @return string
     */
    private function buildDescription(array $config): string
    {
        $houseLabels = [
            'moderne' => 'une villa contemporaine lumineuse',
            'normand' => 'une maison française au charme traditionnel',
            'bois' => 'une maison en bois chaleureuse et sobre',
            'bungalow' => 'un bungalow minimaliste de plain-pied',
        ];
        $moodLabels = [
            'famille' => 'pensée pour la vie de famille',
            'vacances' => 'imaginée comme un refuge de week-end',
            'archi' => "portée par une écriture architecturale nette",
            'nature' => 'ancrée dans une lecture paysagère du terrain',
        ];

        return sprintf(
            "Sur ce terrain d'Herbeville, %s peut prendre place avec naturel. Le projet est %s, avec une mise en scène extérieure autour de %s.",
            $houseLabels[$config['house']] ?? $houseLabels['moderne'],
            $moodLabels[$config['mood']] ?? $moodLabels['famille'],
            implode(', ', $config['garden'])
        );
    }

    /**
     * @param array{house:string,roof:string,garden:list<string>,mood:string} $config
     * @return string
     */
    private function buildBlenderPrompt(array $config): string
    {
        return sprintf(
            'Low-poly residential concept on a French building lot in Herbeville, %s house, %s roof, %s garden elements, cinematic golden-hour lighting, restrained materials, sale-oriented exterior render.',
            $config['house'],
            $config['roof'],
            implode(', ', $config['garden'])
        );
    }
}
