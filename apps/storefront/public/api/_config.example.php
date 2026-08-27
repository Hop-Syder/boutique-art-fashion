<?php
/**
 * Copier ce fichier en _config.php (même dossier) et renseigner de vraies
 * valeurs avant tout déploiement. _config.php n'est pas versionné (voir
 * .gitignore) car il contient des secrets.
 */
define('ADMIN_EMAIL', 'admin@example.com');
define('ADMIN_PASSWORD', 'change-me');
// Générer avec : php -r "echo bin2hex(random_bytes(32));"
define('TOKEN_SECRET', 'generate-a-long-random-string-here');
define('TOKEN_TTL', 60 * 60 * 24 * 7); // durée de validité du token, en secondes (7 jours)
