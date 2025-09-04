<?php
/**
 * Plugin Name:     ShuffleJS Post Filter
 * Plugin URI:      https://github.com/WenderHost/shufflejs-post-filter
 * Description:     Displays an archive of posts along with filters using Shuffle.js
 * Author:          TheWebist
 * Author URI:      https://mwender.com
 * Text Domain:     shufflejs-post-filter
 * Domain Path:     /languages
 * Version:         2.1.1
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
