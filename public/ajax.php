<?php
// Will be setup by apache or use fallback
$appPath = getenv('APPLICATION_PATH');
if ($appPath == false) {
    $appPath = realpath(dirname(__FILE__) . '/../application');
}

define('APPLICATION_PATH', $appPath);
define('APPLICATION_ENV', getenv('APPLICATION_ENV'));
define('MAILER_PASSWORD', getenv('MAILER_PASSWORD'));

define('PHP_SESSION_HANDLER', getenv('PHP_SESSION_HANDLER'));
define('PHP_SESSION_PATH', getenv('PHP_SESSION_PATH'));
define('PHP_SESSION_TTL', getenv('PHP_SESSION_TTL'));
define('CRYPTO_PHONE_VERIFICATION_KEY', getenv('CRYPTO_PHONE_VERIFICATION_KEY'));
define('S3_CDN_URL', getenv('S3_CDN_URL'));
define('STATIC_HOST', getenv('STATIC_HOST'));
define('FEED_HOST', getenv('FEED_HOST'));
define('FEED_PORT', getenv('FEED_PORT'));
define('FEED_SCHEME', getenv('FEED_SCHEME'));
define('APP_HOST', getenv('APP_HOST'));
define('CACHE_MAIN_HOST', getenv('CACHE_MAIN_HOST'));
define('CACHE_MAIN_PORT', getenv('CACHE_MAIN_PORT'));
define('CACHE_SESSION_HOST', getenv('CACHE_SESSION_HOST'));
define('CACHE_SESSION_PORT', getenv('CACHE_SESSION_PORT'));
define('CACHE_STAGING_HOST', getenv('CACHE_STAGING_HOST'));
define('CACHE_STAGING_PORT', getenv('CACHE_STAGING_PORT'));
define('MAILER_SCHEME', getenv('MAILER_SCHEME'));
define('MAILER_HOST', getenv('MAILER_HOST'));
define('MAILER_USER', getenv('MAILER_USER'));
define('TOOLS_SCHEME', getenv('TOOLS_SCHEME'));
define('TOOLS_HOST', getenv('TOOLS_HOST'));
define('TOOLS_USER', getenv('TOOLS_USER'));
define('TOOLS_PASSWORD', getenv('TOOLS_PASSWORD'));
define('ANALYTICS_SCHEME', getenv('ANALYTICS_SCHEME'));
define('ANALYTICS_HOST', getenv('ANALYTICS_HOST'));
define('ZONE_KEY', getenv('ZONE_KEY'));

set_include_path(implode(PATH_SEPARATOR, array(realpath(APPLICATION_PATH . '/../library'), get_include_path())));

require_once 'Zend/Application.php';
require_once APPLICATION_PATH . '/../vendor/autoload.php';

$application = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
$application->bootstrap()->run();
