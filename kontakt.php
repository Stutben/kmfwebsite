<?php
// Kontaktformular KMF 2027 – sendet die Nachricht per E-Mail an den Verein.
// Es werden keine Daten gespeichert oder protokolliert.

const RECIPIENT = 'info@mv-zimmern.de';
const SENDER    = 'info@mv-zimmern.de'; // muss eine Adresse der eigenen Domain sein, sonst verwerfen viele Mailserver die Mail

$wantsJson = ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch';

function respond(bool $ok, string $message, bool $wantsJson): void {
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($ok ? 200 : 400);
        echo json_encode(['ok' => $ok, 'message' => $message]);
    } else {
        header('Location: kontakt.html?' . ($ok ? 'sent=1' : 'error=1'));
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// Honeypot: Bots füllen das versteckte Feld aus. Wir tun so, als wäre alles gut.
if (!empty($_POST['website'])) {
    respond(true, 'Vielen Dank für Ihre Nachricht!', $wantsJson);
}

$clean = fn(string $v): string => trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v));
$name    = $clean($_POST['name'] ?? '');
$email   = $clean($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || empty($_POST['privacy'])
    || mb_strlen($name) > 100 || mb_strlen($email) > 150 || mb_strlen($message) > 3000) {
    respond(false, 'Bitte füllen Sie alle Felder korrekt aus.', $wantsJson);
}

$subject = '=?UTF-8?B?' . base64_encode('KMF 2027 – Kontaktformular: ' . $name) . '?=';
$body    = "Name: $name\nE-Mail: $email\n\n$message\n";
$headers = [
    'From' => 'KMF 2027 Website <' . SENDER . '>',
    'Reply-To' => '=?UTF-8?B?' . base64_encode($name) . '?= <' . $email . '>',
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
];

if (mail(RECIPIENT, $subject, $body, $headers)) {
    respond(true, 'Vielen Dank! Ihre Nachricht wurde gesendet.', $wantsJson);
}
respond(false, 'Die Nachricht konnte leider nicht gesendet werden. Bitte schreiben Sie uns direkt an ' . RECIPIENT . '.', $wantsJson);
