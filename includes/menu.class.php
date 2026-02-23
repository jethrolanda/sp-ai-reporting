<?php

namespace SPAR\Plugin;
 
defined('ABSPATH') || exit;

/**
 * WP Settings Class.
 */
class Menu
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
    add_action('admin_menu', array($this, 'add_plugin_menu'));
    add_action('admin_init', array($this, 'register_settings'));

    
    
    // error_log(print_r(print_r($this->call_ollama_api('Say hello in 5 words'),true),true));

   
 
  }

  private function query_ollama($question, $filtered_data) {
    $prompt = $this->build_prompt($question, $filtered_data);
    
    $response = wp_remote_post('http://ollama:11434/api/generate', array(
        'headers' => array('Content-Type' => 'application/json'),
        'body' => json_encode(array(
            'model' => 'llama3.2',
            'prompt' => $prompt,
            'stream' => false,
            'options' => array(
                'temperature' => 0.1,
                'num_ctx' => 4096 // Context window
            )
        )),
        'timeout' => 90
    ));
    
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }
    
    $body = json_decode(wp_remote_retrieve_body($response), true);
    return $body['response'] ?? 'No response';
  }
    
  /**
   * Build optimized prompt
   */
  private function build_prompt($question, $filtered_data) {
    $data_json = json_encode($filtered_data, JSON_PRETTY_PRINT);
    
    return <<<PROMPT
      You are a rugby statistics expert. Answer the question using ONLY the provided data.
      Be precise with numbers and dates. If information isn't in the data, say so clearly.

      DATA:
      {$data_json}

      QUESTION: {$question}

      Provide a clear, concise answer with specific statistics:
      PROMPT;
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

  public function add_plugin_menu()
  {
    add_submenu_page(
      'rugbyexplorer',
      __('SportsPress Reporting', 'sp-ai-reporting'),
      __('SportsPress Reporting', 'sp-ai-reporting'),
      'manage_options',
      'sp-ai-reporting-settings',
      array($this, 'render_settings_page')
    ); 
  }
  /**
   * Register Settings
   */
  public function register_settings() {
      register_setting(
          'ai_sportspress_settings_group',
          'ai_sportspress_settings',
          [
              'sanitize_callback' => array($this, 'ai_sportspress_sanitize_settings')
          ]
      );

      add_settings_section(
          'ai_sportspress_main_section',
          'OpenAI Configuration',
          null,
          'ai-sportspress-settings'
      );

      add_settings_field(
          'api_key',
          'OpenAI API Key',
          array($this, 'ai_sportspress_api_key_field'),
          'ai-sportspress-settings',
          'ai_sportspress_main_section'
      );

      add_settings_field(
          'model',
          'Model',
          array($this, 'ai_sportspress_model_field'),
          'ai-sportspress-settings',
          'ai_sportspress_main_section'
      );

      add_settings_field(
          'max_tokens',
          'Max Tokens',
          array($this, 'ai_sportspress_tokens_field'),
          'ai-sportspress-settings',
          'ai_sportspress_main_section'
      );
  }

  /**
   * Sanitize Settings
   */
  public function ai_sportspress_sanitize_settings($input) {

      return [
          'api_key'    => sanitize_text_field($input['api_key'] ?? ''),
          'model'      => sanitize_text_field($input['model'] ?? 'gpt-4.1'),
          'max_tokens' => intval($input['max_tokens'] ?? 600),
      ];
  }

  /**
   * Fields
   */
  public function ai_sportspress_api_key_field() {
      $options = get_option('ai_sportspress_settings');
      ?>
      <input type="password"
            name="ai_sportspress_settings[api_key]"
            value="<?php echo esc_attr($options['api_key'] ?? ''); ?>"
            class="regular-text" />
      <?php
  }

  public function ai_sportspress_model_field() {
      $options = get_option('ai_sportspress_settings');
      ?>
      <select name="ai_sportspress_settings[model]">
          <option value="gpt-4.1" <?php selected($options['model'] ?? '', 'gpt-4.1'); ?>>GPT-4.1</option>
          <option value="gpt-4.1-mini" <?php selected($options['model'] ?? '', 'gpt-4.1-mini'); ?>>GPT-4.1 Mini</option>
      </select>
      <?php
  }

  public function ai_sportspress_tokens_field() {
      $options = get_option('ai_sportspress_settings');
      ?>
      <input type="number"
            name="ai_sportspress_settings[max_tokens]"
            value="<?php echo esc_attr($options['max_tokens'] ?? 600); ?>"
            min="100"
            max="2000" />
      <?php
  }

  /**
   * Settings Page Output
   */
  public function render_settings_page() { ?>
    <div class="wrap">
        <h1>AI SportsPress Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('ai_sportspress_settings_group');
            do_settings_sections('ai-sportspress-settings');
            submit_button();
            ?>
        </form>
    </div><?php
  }
}
