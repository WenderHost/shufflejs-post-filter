<?php

namespace ShufflejsPostFilter\enqueues;

function register_scripts(){
  wp_register_script( 'postfilter', plugin_dir_url( __FILE__ ) . '../js/dist/bundle.js', null, filemtime( plugin_dir_path( __FILE__ ) . '../js/dist/bundle.js' ), true );
  wp_register_style( 'postfilter', plugin_dir_url( __FILE__ ) . '../css/postfilter.css', null, plugin_dir_url( __FILE__ ) . '../css/postfilter.css' );
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\register_scripts' );