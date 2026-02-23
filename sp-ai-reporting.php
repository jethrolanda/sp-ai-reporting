<?php

/**
 * Plugin Name: Sportspress AI Reporting
 * Description: Sportspress AI Reporting is a WordPress plugin that provides AI-powered reporting and analytics for sports teams and organizations. It offers insights into player performance, team dynamics, and game strategies, helping coaches and analysts make informed decisions.
 * Version: 1.0
 * Author: Jethrolanda
 * Author URI: https://jethrolanda.com/
 * Text Domain: wp-plugin-boilerplate
 * Domain Path: /languages/
 * Requires at least: 5.7
 * Requires PHP: 7.2
 */

defined('ABSPATH') || exit;

// Path Constants ======================================================================================================

define('SPAR_PLUGIN_URL',             plugins_url() . '/sp-ai-reporting/');
define('SPAR_PLUGIN_DIR',             plugin_dir_path(__FILE__));
define('SPAR_CSS_ROOT_URL',           SPAR_PLUGIN_URL . 'css/');
define('SPAR_JS_ROOT_URL',            SPAR_PLUGIN_URL . 'js/');
define('SPAR_JS_ROOT_DIR',            SPAR_PLUGIN_DIR . 'js/');
define('SPAR_TEMPLATES_ROOT_URL',     SPAR_PLUGIN_URL . 'templates/');
define('SPAR_TEMPLATES_ROOT_DIR',     SPAR_PLUGIN_DIR . 'templates/');
define('SPAR_BLOCKS_ROOT_URL',        SPAR_PLUGIN_URL . 'blocks/');
define('SPAR_BLOCKS_ROOT_DIR',        SPAR_PLUGIN_DIR . 'blocks/');

// Require autoloader
require_once 'inc/autoloader.php';

// Run
require_once 'sp-ai-reporting.plugin.php';
$GLOBALS['spar'] = new SP_AI_Reporting();
