<?php

namespace ShufflejsPostFilter\shortcodes;

function post_filter( $atts ){
  $args = shortcode_atts( [
    'category'            => null,
    'tag'                 => null,
    'post_type'           => 'post',
    'taxonomy'            => null,
    'terms'               => null,
    'limit'               => -1,
    'gridId'              => 'post-grid',
    'default_thumbnail'   => null,
    'filter_class_name'   => 'filter-link-group',
    'order'               => null,
    'orderby'             => null,
    'exclude'             => null,
  ], $atts );

  $args['limit'] = -1; // Force all posts returned until we get LOAD MORE working

  if( ! is_null( $args['default_thumbnail'] ) && is_numeric( $args['default_thumbnail'] ) )
    $args['default_thumbnail'] = wp_get_attachment_image_url( $args['default_thumbnail'], 'large' );

  $query_args = [
    'post_type'       => $args['post_type'],
    'posts_per_page'  => -1,
    'order'           => $args['order'],
    'orderby'         => $args['orderby'],
  ];
  if( 'product' == $args['post_type'] && is_null( $args['order'] ) && is_null( $args['orderby'] ) ){
    $query_args['order'] = 'ASC';
    $query_args['orderby'] = 'menu_order';
  } else if ( 'post' == $args['post_type'] && is_null( $args['order'] ) && is_null( $args['orderby'] ) ){
    $query_args['order'] = 'DESC';
    $query_args['orderby'] = 'date';
  }
  if( ! is_null( $args['taxonomy'] ) && ! is_null( $args['terms'] ) ){
    $query_args['tax_query'] = [
      [
        'taxonomy'  => $args['taxonomy'],
        'field'     => 'slug',
        'terms'     => $args['terms'],
      ]
    ];
  }
  if( ! is_null( $args['exclude'] ) ){
    $query_args['tax_query'][] = [
      'taxonomy'  => 'sub_category',
      'field'     => 'slug',
      'terms'     => explode(',', $args['exclude'] ),
      'operator'  => 'NOT IN',
    ];
  }

  /**
   * While getting terms for each post, we'll set
   * $get_filters == true if a post has terms. Otherwise,
   * we'll leave this set to `false` since we don't need
   * any filters since no terms have been asigned to our
   * posts.
   */
  $get_filters = false;

  $posts = get_posts( $query_args );
  if( $posts ){
    $x = 0;

    // $all_groups holds all terms found in the set of
    // posts returned by our query
    $all_groups = [];
    switch ( $args['post_type'] ) {
      case 'product':
        $taxonomies = ['sub_category','certification'];
        break;

      default:
        $taxonomies = ['resource_type','knowledge_area'];
        break;
    }
    if( ! is_null( $args['taxonomy']) ){
      if( ( $key = array_search( $args['taxonomy'], $taxonomies ) ) !== false ){
        unset( $taxonomies[$key]);
      }
    }

    foreach( $taxonomies as $taxonomy ){
      $all_groups[$taxonomy] = [];
    }

    foreach( $posts as $post ){
      $groups = [];
      $terms = wp_get_object_terms( $post->ID, $taxonomies );
      if( ! empty( $terms ) && ! is_wp_error( $terms ) ){
        foreach( $terms as $term ){
          $groups[] = $term->slug;

          if( ! in_array( $term->slug, $all_groups[$term->taxonomy] ) ){
            $all_groups[$term->taxonomy][] = $term->slug;
          }
        }
      }
      if( 1 < count( $groups ) )
        $get_filters = true;

      $posts_array[$x] = [
        'permalink'   => get_permalink( $post->ID ),
        'thumbnail'   => get_the_post_thumbnail_url( $post->ID, 'large' ),
        'title'       => get_the_title( $post->ID ),
        'esc_title'   => esc_attr( get_the_title( $post->ID ) ),
        'css_classes' => '["' . implode('","', $groups ) . '"]',
        'groups'      => $groups,
      ];

      // Get meta data for posts
      if( 'post' == $args['post_type'] ){
        $knowledge_areas = wp_get_object_terms( $post->ID, ['knowledge_area'] );
        if( $knowledge_areas ){
          $meta_knowledge_areas_array = [];
          foreach( $knowledge_areas as $term ){
            $meta_knowledge_areas_array[] = '<a href="' . get_term_link( $term->term_id ) . '">' . $term->name . '</a>';
          }
        }
        $resource_types = wp_get_object_terms( $post->ID, ['resource_type'] );
        if( $resource_types ){
          $meta_resource_types_array = [];
          foreach( $resource_types as $term ){
            $meta_resource_types_array[] = '<a href="' . get_term_link( $term->term_id ) . '">' . $term->name . '</a>';
          }
        }
        $posts_array[$x]['meta'] = strip_tags( implode(', ', $meta_knowledge_areas_array ) );
        $resource_types_html = ucwords( implode(', ', $meta_resource_types_array) );
        $posts_array[$x]['resource_type'] = strip_tags( $resource_types_html );
      }
      $x++;
    }
    $posts_json = json_encode( $posts_array );
  } else {
    $posts_json = '{ null }';
  }

  wp_enqueue_script( 'postfilter' );
  wp_localize_script( 'postfilter', 'wpvars', [
    'category' => $args['category'],
    'tag' => $args['tag'],
    'post_type' => $args['post_type'],
    'gridId' => $args['gridId'],
    'posts' => $posts_array,
    'defaultThumbnail' => $args['default_thumbnail'],
    'filter_class_name' => $args['filter_class_name'],
    'limit' => $args['limit'],
  ]);
  wp_enqueue_style( 'postfilter' );

  $args['all_groups'] = $all_groups;
  $filter_html = ( $get_filters )? post_search_and_filters( $args ) : '' ;

  return $filter_html . '<ul id="' . $args['gridId'] . '"></ul><div class="post-filter-footer"><a class="button" id="load-more" href="#">Load More</a></div>';
}
add_shortcode( 'postfilter', __NAMESPACE__ . '\\post_filter' );

function post_search_and_filters( $args = [] ){
  $html = '';

  switch( $args['post_type'] ){
    case 'product':
      $taxonomies = ['sub_category','certification'];
      break;

    default:
      $taxonomies = ['resource_type','knowledge_area'];
      break;
  }
  if( ! is_null( $args['taxonomy']) ){
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

    $term_list = ['<li><a href="#" data-filter="*">All</a></li>'];
    foreach( $terms as $term ){
      if( in_array( $term->slug, $args['all_groups'][$term->taxonomy] ) )
        $term_list[] = '<li><a class="filter-link" href="#" data-filter="' . $term->slug . '" data-taxonomy="' . $term->taxonomy . '">' . $term->name . '</a></li>'; //  <span>' . $term->count . '</span>
    }

    $html.= '<div class="filter"><h4>' . ucwords( str_replace( '-', ' ', $taxonomy_obj->label ) ) . '</h4><ul class="filter-link-group" data-taxonomy="' . $taxonomy . '">' . implode( '', $term_list ) . '</ul></div>';
  }
  return $html;

  /*
  // Add search fields
  $search_html = '<div class="filter-search-group"><label class="filter-label">Search</label><br><input class="js-shuffle-search" type="search" id="filters-search-input" /></div>';

  // Add container for alphabetical search
  $alphabetical_search_html = '<div id="js-alphabetical-search"></div>';

  return $search_html . '<div class="filter-groups">' . $html . '</div>' . $alphabetical_search_html;
  */
}