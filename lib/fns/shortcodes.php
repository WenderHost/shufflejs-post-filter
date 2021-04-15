<?php

namespace ShufflejsPostFilter\shortcodes;

/**
 * Displays a ShuffleJS powered listing of posts.
 *
 * RELATED COURSES META QUERY
 * When this function is running on a WooCommerce Product Single, we run
 * a meta query using the Product's `_yoast_wpseo_primary_sub_category`.
 * This allows us to display a listing of Related Courses which have the
 * same Primary Sub Category.
 *
 * In order for this Related Courses query to work, the current Product
 * must be assigned a Primary Sub Category, and there must be other
 * Products (i.e. Courses) assigned the same Primary Sub Category.
 *
 * @param      array  $atts {
 *    @type  string   $category            When querying `posts`, filter the posts by category. Accepts a comma separated list of category slugs.
 *    @type  string   $category_not_in     When querying `posts`, exclude the posts by category. Accepts a comma separated list of category slugs.
 *    @type  int      $default_thumbnail   Default thumbnail ID.
 *    @type  string   $exclude             List of terms to exclude from the ShuffleJS filter list.
 *    @type  string   $filter_class_name   Filter class name.
 *    @type  int      $gridId              Will be used as the HTML id attribute. Must be unique on the output page.
 *    @type  int      $limit               Set the number of initial results as well as the size of each page of results. Defaults to `30`, set to
 *                                         `-1` for "Endless Scroll".
 *    @type  int      $mobile_break_point  Minimum width in pixels for mobile adjustments. For example, we are removing the Newsletter Sign Up form
 *                                         in the Knowledge Center feed when viewing on mobile. (Default: 500)
 *    @type  string   $order               Either ASC or DESC.
 *    @type  string   $orderby             The column we're sorting by.
 *    @type  string   $post__in            Comma separated list of Post IDs.
 *    @type  string   $post_type           The post_type.
 *    @type  int      $posts_per_page      The number of posts to return. Default -1.
 *    @type  string   $primary_role        The slug of the `role` you want to highlight when displaying "Roles/Professional Levels"
 *                                         as a filter. For example, if you want to use "Agile Coaching" as the filter under
 *                                         "Professional Levels", you set the $primary_role to `agile-coaching`, and your
 *                                         "Professional Levels" filters will show as "Advanced", "Awareness", "Core", and
 *                                         "Supporting" for "Agile Coaching".
 *    @type  bool     $include_all         Used with `post__in`, includes all other posts after initial set listed in `post__in`.
 *    @type  bool     $show_all_filters    Set this to TRUE when using the `primary_role` attribute to also show the `primary_role` as a filter.
 *    @type  bool     $show_filters        Show the filters?
 *    @type  string   $tag                 The tag. (?)
 *    @type  string   $taxonomies_display  Comma separated list of taxonomy slugs we want to display filters for.
 *    @type  string   $taxonomy            The taxonomy we're displaying as buttons.
 *    @type  string   $terms               The terms. (?)
 * }
 *
 * @return     string  HTML for displaying our ShuffleJS filter and list of posts.
 */
function post_filter( $atts ){
  $args = shortcode_atts([
    'category'                  => null,
    'category_not_in'           => null,
    'default_thumbnail'         => null,
    'exclude'                   => null,
    'filter_class_name'         => 'filter-link-group',
    'gridId'                    => 'post-grid',
    'limit'                     => 30,
    'mobile_break_point'        => 500,
    'order'                     => null,
    'orderby'                   => null,
    'post__in'                  => null,
    'post_type'                 => 'post',
    'posts_per_page'            => -1,
    'primary_role'              => null,
    'include_all'               => false,
    'show_all_filters'          => false,
    'show_filters'              => true,
    'tag'                       => null,
    'taxonomies_display'        => null,
    'taxonomy'                  => null,
    'terms'                     => null,
  ], $atts );

  $html = []; // Initialize array for storing our HTML

  // Setup boolean arguments
  if( 'false' === $args['include_all'] ) $args['include_all'] = false;
  $args['include_all'] = (bool) $args['include_all'];

  if( $args['show_all_filters'] === 'false' ) $args['show_all_filters'] = false;
  $args['show_all_filters'] = (bool) $args['show_all_filters'];

  if( $args['show_filters'] === 'false' ) $args['show_filters'] = false;
  $args['show_filters'] = (bool) $args['show_filters'];

  if( ! is_int( $args['mobile_break_point'] ) )
    $args['mobile_break_point'] = 500;

  // Grab the $term_id of the `primary_role`
  $primary_role_id = false;
  if( ! is_null( $args['primary_role'] ) ){
    $primary_role = get_term_by( 'slug', esc_attr( $args['primary_role'] ), 'role' );
    if( ! $primary_role ){
      $html[] = '<p><strong>Invalid primary_role</strong><br/>ERROR: You specifed a <code>primary_role</code> of "' . $args['primary_role'] . '", but it was not found.</p>';
    } else {
      $primary_role_id = $primary_role->term_id;
    }
  }

  // Set our default thumbnail
  if( ! is_null( $args['default_thumbnail'] ) && is_numeric( $args['default_thumbnail'] ) )
    $args['default_thumbnail'] = wp_get_attachment_image_url( $args['default_thumbnail'], 'large' );

  $query_args = [
    'post_type'       => $args['post_type'],
    'posts_per_page'  => $args['posts_per_page'],
  ];

  // Setup categories
  if( isset( $args['category'] ) && ! is_null( $args['category'] ) ){
    $cat_array = [];
    $categories = ( stristr( $args['category'], ',' ) )? explode( ',', $args['category'] ) : [ $args['category'] ] ;
    foreach ($categories as $category_slug ) {
      $category = get_category_by_slug( $category_slug );
      if( $category )
        $cat_array[] = $category->term_id;
    }
    if( 0 < count( $cat_array ) )
      $query_args['category'] = implode( ',', $cat_array );
  }

  // Setup category__not_in
  if( isset( $args['category_not_in'] ) && ! is_null( $args['category_not_in'] ) ){
    $cat_array = [];
    $categories = ( stristr( $args['category_not_in'], ',' ) )? explode( ',', $args['category_not_in'] ) : [ $args['category_not_in'] ] ;
    foreach ($categories as $category_slug ) {
      $category = get_category_by_slug( $category_slug );
      if( $category )
        $cat_array[] = $category->term_id;
    }
    if( 0 < count( $cat_array ) )
      $query_args['category__not_in'] = implode( ',', $cat_array );
  }

  // Specify set of posts by `post__in`
  if( ! is_null( $args['post__in'] ) ){
    if( ! stristr( $args['post__in'], ',' ) ){
      $post__in = array( $args['post__in'] );
    } else {
      $post__in = array_map( 'trim', explode( ',', $args['post__in'] ) );
    }
    $query_args['post__in'] = $post__in;
    $query_args['orderby'] = 'post__in';
  } else {
    if( 'product' == $args['post_type'] && is_null( $args['order'] ) && is_null( $args['orderby'] ) ){
      $query_args['order'] = 'ASC';
      $query_args['orderby'] = 'menu_order';
    } else if ( 'post' == $args['post_type'] && is_null( $args['order'] ) && is_null( $args['orderby'] ) ){
      $query_args['order'] = 'DESC';
      $query_args['orderby'] = 'date';
    } else {
      $query_args['order'] = $args['order'];
      $query_args['orderby'] = $args['orderby'];
    }
  }

  // Setup our `tax_query` when we have `taxonomy` and `terms` set
  if( ! is_null( $args['taxonomy'] ) && ! is_null( $args['terms'] ) ){
    $query_args['tax_query'] = [
      [
        'taxonomy'  => $args['taxonomy'],
        'field'     => 'slug',
        'terms'     => $args['terms'],
      ]
    ];
  }

  // Setup our related Courses meta query when we are viewing a WooCommerce Product:
  // SELECT courses WHERE `_yoast_wpseo_primary_sub_category` == current_course._yoast_wpseo_primary_sub_category
  global $post;
  if( 'product' == get_post_type( $post ) ){
    $primary_sub_category = get_post_meta( $post->ID, '_yoast_wpseo_primary_sub_category', true );
    $query_args['meta_key'] = '_yoast_wpseo_primary_sub_category';
    $query_args['meta_value'] = $primary_sub_category;
    $query_args['meta_type'] = 'NUMERIC';
    $query_args['meta_compare'] = '=';
    $query_args['post__not_in'] = [$post->ID];
  }

  /**
   * While getting terms for each post, we'll set
   * $get_filters == true if a post has terms. Otherwise,
   * we'll leave this set to `false` since we don't need
   * any filters since no terms have been assigned to our
   * posts.
   */
  $get_filters = false;

  if( NETMIND_DEBUG )
    uber_log('[postfilter] $query_args = ' . print_r( $query_args, true ) );
  $posts = get_posts( $query_args );

  // Include all other posts?
  if( $args['include_all'] && ! is_null( $args['post__in'] ) ){
    $query_args['post__not_in'] = $query_args['post__in'];
    $query_args['order'] = 'ASC';
    $query_args['orderby'] = 'menu_order';
    unset( $query_args['post__in'] );
    $additional_posts = get_posts( $query_args );
    if( $additional_posts )
      $posts = array_merge( $posts, $additional_posts );
  }

  if( $posts ){
    $x = 0;
    // $all_groups holds all terms found in the set of posts returned by our query
    $all_groups = [];
    if( isset( $args['taxonomies_display'] ) && ! is_null( $args['taxonomies_display'] ) ){
      $taxonomies = ( stristr( $args['taxonomies_display'], ',' ) )? explode( ',', $args['taxonomies_display'] ) : [ $args['taxonomies_display'] ] ;
    } else {
      switch ( $args['post_type'] ) {
        case 'product':
          $taxonomies = ['sub_category','certification'];
          break;

        default:
          $taxonomies = ['resource_type','knowledge_area','best_practice'];
          break;
      }
    }
    /*
    if( ! is_null( $args['taxonomy']) ){
      if( ( $key = array_search( $args['taxonomy'], $taxonomies ) ) !== false ){
        unset( $taxonomies[$key]);
      }
    }
    /**/
    foreach( $taxonomies as $taxonomy ){
      $all_groups[$taxonomy] = [];
    }

    foreach( $posts as $post ){
      $groups = [];

      foreach ( $taxonomies as $taxonomy ) {
        if( PF_DEV_MODE ){
          $terms = wp_get_post_terms( $post->ID, $taxonomy ); // wp_get_post_terms() is uncached
        } else {
          $terms = get_the_terms( $post->ID, $taxonomy ); // get_the_terms() is cached
        }

        if( ! empty( $terms ) && ! is_wp_error( $terms ) ){

          foreach ( $terms as $term ) {
            // "Primary Role/Professional Level" Filtering
            if( 'role' == $taxonomy && $primary_role_id ){
              // 1. If the current term is our Primary Role, skip it.
              if( $term->term_id == $primary_role_id )
                continue;
              // 2. If the current term is not a child of the Primary Role, skip it.
              if( $term->parent != $primary_role_id )
                continue;
            }

            $groups[] = $term->slug;
            if( ! in_array( $term->slug, $all_groups[$term->taxonomy] ) )
              $all_groups[$term->taxonomy][] = $term->slug;
          }
        }
      }

      if( 0 < count( $groups ) )
        $get_filters = true;

      // Set "new" for posts <= 3 months old
      $timestamp = get_the_date( 'U', $post->ID );
      $new = ( current_time( 'timestamp' ) <= $timestamp + ( MONTH_IN_SECONDS * 3 ) )? true : false ;

      $meta = []; // Populate this array with the post's meta
      $raw_meta = get_post_meta( $post->ID );
      foreach ( $raw_meta as $key => $value ) {
        if( '_course' == substr( $key, 0, 7 ) ){
          $new_key = substr( $key, 1, ( strlen( $key ) - 1 ) );
          $data = @unserialize( $value[0] );
          $meta[$new_key] = ( $data !== false )? $data : $value[0];
        }
      }
      $meta['face_to_face'] = false;
      $meta['virtual'] = false;
      if( array_key_exists( 'course_delivery_mode', $meta ) ){
        $delivery_modes = $meta['course_delivery_mode'];
        $meta['face_to_face'] = ( in_array('Face-to-Face', $delivery_modes ) )? true : false ;
        $meta['virtual'] = ( in_array('Virtual', $delivery_modes ) )? true : false ;
      }
      $excerpt = strip_tags( get_the_content( null, false, $post->ID ) ); // get_the_excerpt( $post->ID )
      //$excerpt = get_the_excerpt( $post->ID );

      //*
      if( (2 == $x) && ('post' == $args['post_type']) ){
        $posts_array[$x] = [
          'post_type' => 'signup',
          'permalink'   => null,
          'thumbnail'   => null,
          'title'       => 'newsletter_form',
          'esc_title'   => 'Form Goes Here',
          'css_classes' => '["' . implode('","', $groups ) . '"]',
          'groups'      => $groups,
          'new'         => null,
          'meta'        => null,
          'excerpt'     => 'Newsletter sign up form goes here.',
        ];
        $x++;
      }
      /**/

      $posts_array[$x] = [
        'permalink'   => get_permalink( $post->ID ),
        'thumbnail'   => get_the_post_thumbnail_url( $post->ID, 'large' ),
        'title'       => get_the_title( $post->ID ),
        'esc_title'   => esc_attr( get_the_title( $post->ID ) ),
        'css_classes' => '["' . implode('","', $groups ) . '"]',
        'groups'      => $groups,
        'new'         => $new,
        'meta'        => $meta,
        'excerpt'     => str_replace('Introduction', '', $excerpt ),
      ];

      // Get meta data for posts
      if( 'post' == $args['post_type'] ){
        $knowledge_areas = wp_get_object_terms( $post->ID, ['knowledge_area'] );
        if( $knowledge_areas ){
          $meta_knowledge_areas_array = [];
          foreach( $knowledge_areas as $term ){
            $meta_knowledge_areas_array[] = '<a href="' . get_term_link( $term->term_id ) . '">' . $term->name . '</a>';
          }
          $posts_array[$x]['meta'] = strip_tags( implode(', ', $meta_knowledge_areas_array ) );
        }

        $resource_types = wp_get_object_terms( $post->ID, ['resource_type'] );
        if( $resource_types ){
          $meta_resource_types_array = [];
          foreach( $resource_types as $term ){
            $meta_resource_types_array[] = '<a href="' . get_term_link( $term->term_id ) . '">' . $term->name . '</a>';
          }
          $resource_types_html = ucwords( implode(', ', $meta_resource_types_array) );
          $posts_array[$x]['resource_type'] = strip_tags( $resource_types_html );
        }

        $best_practices = wp_get_object_terms( $post->ID, ['best_practice'] );
        if( $best_practices ){
          $meta_best_practices_array = [];
          foreach( $best_practices as $term ){
            $meta_best_practices_array[] = '<a href="' . get_term_link( $term->term_id ) . '">' . $term->name . '</a>';
          }
          $best_practices_html = ucwords( implode( ', ', $meta_best_practices_array ) );
          $posts_array[$x]['best_practice'] = strip_tags( $best_practices_html );
        }

        $news_categories = wp_get_object_terms( $post->ID, ['news_category'] );
        if( $news_categories ){
          $meta_news_categories_array = [];
          foreach( $news_categories as $term ){
            $meta_news_categories_array[] = '<a href="' . get_term_link( $term->term_id ) . '">' . $term->name . '</a>';
          }
          $news_categories_html = ucwords( implode( ', ', $meta_news_categories_array ) );
          $posts_array[$x]['news_category'] = strip_tags( $news_categories_html );
        }

      }
      $x++;
    }
    // Restore $post to global query $post object
    wp_reset_postdata();
    $posts_json = json_encode( $posts_array );
  } else {
    $posts_json = '{ null }';
    $posts_array = [];
  }

  wp_enqueue_script( 'postfilter' );

  // Get the Newsletter Sign Up form:
  $newsletter_form = get_page_by_title( 'Newsletter Signup Template', OBJECT, 'elementor_library' );
  $pluginElementor = \Elementor\Plugin::instance();
  $newsletterForm = $pluginElementor->frontend->get_builder_content( $newsletter_form->ID );

  wp_localize_script( 'postfilter', 'wpvars', [
    'category' => $args['category'],
    'tag' => $args['tag'],
    'post_type' => $args['post_type'],
    'gridId' => $args['gridId'],
    'posts' => $posts_array,
    'defaultThumbnail' => $args['default_thumbnail'],
    'filter_class_name' => $args['filter_class_name'],
    'limit' => $args['limit'],
    'mobileBreakPoint' => $args['mobile_break_point'],
    'newsletterForm' => $newsletterForm,
    'confirmationMessage' => __( 'Almost done! Please check your email to confirm your subscription.', 'shufflejs-post-filter' ),
    'labels' => [
      'faceToFace' => __( 'Face-to-Face', 'shufflejs-post-filter' ),
    ],
  ]);
  wp_enqueue_style( 'postfilter' );

  if( isset( $all_groups ) )
    $args['all_groups'] = $all_groups;
  $filter_html = ( $get_filters && $args['show_filters'] )? post_search_and_filters( $args ) : '' ;
  if( ( $get_filters && $args['show_filters'] ) )
    $html[] = post_search_and_filters( $args );

  $html[] = '<ul id="' . $args['gridId'] . '"></ul><div class="post-filter-footer"><a class="button" id="load-more" href="#">Load More</a></div>';

  return implode("\n", $html );
}
add_shortcode( 'postfilter', __NAMESPACE__ . '\\post_filter' );

/**
 * Builds the HTML for our filter button UI.
 *
 * @param      array   $args   The arguments
 *
 * @return     string  HTML for the filter buttons.
 */
function post_search_and_filters( $args = [] ){
  //uber_log('🔔 post_search_and_filters() $args = ' . print_r( $args, true ) );
  $html = [];
  //$html[] = '<pre>$args = ' . print_r( $args, true ) . '</pre>';
  $html[] = '<div id="shuffleFilterTop" style="height: 1px;"></div>';

  if( isset( $args['taxonomies_display'] ) && ! is_null( $args['taxonomies_display'] ) ){
    $taxonomies = explode( ',', $args['taxonomies_display'] );
  } else {
    switch( $args['post_type'] ){
      case 'product':
        $taxonomies = ['sub_category','certification'];
        break;

      default:
        $taxonomies = ['resource_type','knowledge_area','best_practice'];
        break;
    }
  }

  if( ! is_null( $args['taxonomy']) && ( false == $args['show_all_filters'] ) ){
    if( ( $key = array_search( $args['taxonomy'], $taxonomies ) ) !== false ){
      unset( $taxonomies[$key]);
    }
  }

  foreach( $taxonomies as $taxonomy ){
    $taxonomy_obj = get_taxonomy( $taxonomy );
    $terms = get_terms([
      'hide_empty' => true,
      'taxonomy' => $taxonomy,
      'hierarchical' => false,
    ]);

    $term_list = ['<li><a href="#" data-filter="*">' . __( 'All', 'shufflejs-post-filter' ) . '</a></li>'];
    $exclude_array = explode( ',', str_replace(' ', '', $args['exclude'] ) );
    foreach( $terms as $term ){
      if( in_array( $term->slug, $exclude_array ) )
        continue;

      if(
        array_key_exists( $term->taxonomy, $args['all_groups'] )
        && is_array( $args['all_groups'][$term->taxonomy] )
        && in_array( $term->slug, $args['all_groups'][$term->taxonomy] )
      )
        $term_list[] = '<li><a class="filter-link" href="#" data-filter="' . $term->slug . '" data-taxonomy="' . $term->taxonomy . '">' . $term->name . '</a></li>'; //  <span>' . $term->count . '</span>
    }

    switch( strtolower( $taxonomy_obj->label ) ){
      case 'roles':
        $heading = __( 'Professional Level', 'shufflejs-post-filter' );
        break;

      default:
        $heading = str_replace( '-', ' ', $taxonomy_obj->label );
        break;
    }

    $html[] = '<div class="filter"><h4>' . $heading . '</h4><ul class="filter-link-group ' . $taxonomy . '" data-taxonomy="' . $taxonomy . '">' . implode( '', $term_list ) . '</ul></div>';
  }
  return implode( '', $html );
}