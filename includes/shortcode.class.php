<?php

namespace SPAR\Plugin;


defined('ABSPATH') || exit;

class Shortcode
{
  /**
   * The single instance of the class.
   *
   * @since 1.0
   */
  protected static $_instance = null;

  /**
   * Class constructor.
   *
   * @since 1.0.0
   */
  public function __construct()
  {
    add_shortcode('ai_prompt_frontend', array($this, 'ai_prompt_frontend'));
  }

  /**
   * Main Instance.
   * 
   * @since 1.0
   */
  public static function instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }

  public function ai_prompt_frontend($atts)
  {
    $atts = shortcode_atts(array(
      'foo' => 'no foo',
      'baz' => 'default baz'
    ), $atts, 'ai_prompt_frontend');

    ob_start();

    echo '<div id="ai-prompt-frontend"></div>';
    return ob_get_clean();
  }
}
