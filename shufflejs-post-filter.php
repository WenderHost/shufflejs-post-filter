<?php
/**
 * Plugin Name:     ShuffleJS Post Filter
 * Plugin URI:      https://github.com/WenderHost/shufflejs-post-filter
 * Description:     Displays an archive of posts along with filters using Shuffle.js
 * Author:          TheWebist
 * Author URI:      https://mwender.com
 * Text Domain:     shufflejs-post-filter
 * Domain Path:     /languages
 * Version:         2.0.5
 *
 * @package         Shufflejs_Post_Filter
 */
$dev_mode = ( stristr( site_url(), '.local' ) )? true : false ;
define( 'PF_DEV_MODE', $dev_mode );

// Include files
require_once 'lib/fns/enqueues.php';
require_once 'lib/fns/shortcodes.php';

// Load Translation
function shufflejs_load_textdomain(){
  load_plugin_textdomain( 'shufflejs-post-filter', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'shufflejs_load_textdomain' );

/**
 * Enhanced error logging
 *
 * @param      string  $message  The message
 */
if( ! function_exists( 'uber_log') ){
  function uber_log( $message = null ){
    static $counter = 1;

    $bt = debug_backtrace();
    $caller = array_shift( $bt );

    if( 1 == $counter )
      error_log( "\n\n" . str_repeat('-', 25 ) . ' STARTING DEBUG [' . date('h:i:sa', current_time('timestamp') ) . '] ' . str_repeat('-', 25 ) . "\n\n" );
    error_log( $counter . '. ' . basename( $caller['file'] ) . '::' . $caller['line'] . ' ' . $message );
    $counter++;
  }
}