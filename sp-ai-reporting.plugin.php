<?php
if (!defined('ABSPATH')) {
	exit;
}
// Exit if accessed directly


class SP_AI_Reporting
{

	/*
    |------------------------------------------------------------------------------------------------------------------
    | Class Members
    |------------------------------------------------------------------------------------------------------------------
     */
	private static $_instance;

	public $menu;
	public $scripts;
	public $ajax;
	public $shortcode;
	public $rest;

	const VERSION = '1.0';

	/*
  |------------------------------------------------------------------------------------------------------------------
  | Mesc Functions
  |------------------------------------------------------------------------------------------------------------------
  */

	/**
	 * Class constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct()
	{

		$this->menu = SPAR\Plugin\Menu::instance();
		$this->scripts = SPAR\Plugin\Scripts::instance();
		$this->ajax = SPAR\Plugin\Ajax::instance();
		$this->shortcode = SPAR\Plugin\Shortcode::instance();
		$this->rest = SPAR\Plugin\Rest::instance();

		// Register Activation Hook
		register_activation_hook(SPAR_PLUGIN_DIR . 'sp-ai-reporting.php', array($this, 'activate'));

		// Register Deactivation Hook
		register_deactivation_hook(SPAR_PLUGIN_DIR . 'sp-ai-reporting.php', array($this, 'deactivate'));
	}

	/**
	 * Singleton Pattern.
	 *
	 * @since 1.0.0
	 */
	public static function instance()
	{

		if (!self::$_instance instanceof self) {
			self::$_instance = new self;
		}

		return self::$_instance;
	}


	/**
	 * Trigger on activation
	 *
	 * @since 1.0.0
	 */
	public function activate() {}

	/**
	 * Trigger on deactivation
	 *
	 * @since 1.0.0
	 */
	public function deactivate() {}
}
