<?php
/**
 * @var \App\View\AppView $this
 */
$this->disableAutoLayout();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?= $this->Html->charset() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Herbeville Frontend Build</title>
    <style>
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            background: #111413;
            color: #f4efe7;
        }
        main {
            max-width: 760px;
            margin: 0 auto;
            padding: 56px 24px;
        }
        h1 {
            font-size: 2rem;
            margin: 0 0 12px;
        }
        p {
            line-height: 1.6;
            color: #d5cec2;
        }
        code, pre {
            font-family: Consolas, monospace;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 6px;
        }
        code {
            padding: 2px 6px;
        }
        pre {
            padding: 16px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <main>
        <h1>Herbeville frontend er ikke bygget endnu</h1>
        <p>
            Denne kodebase hoster React/Vite-appen via CakePHP, men den kompilerede build
            mangler stadig i <code>webroot/herbeville-app/</code>.
        </p>
        <p>Kør nedenstående i frontend-mappen og genindlæs derefter <code>/herbeville</code>.</p>
        <pre>cd public/models/herbeville
npm install
npm run build</pre>
        <p>
            Kildekode: <code>public/models/herbeville</code><br>
            Build-target: <code>webroot/herbeville-app</code>
        </p>
    </main>
</body>
</html>
