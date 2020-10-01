=== ShuffleJS Post Filter ===
Contributors: TheWebist
Tags: comments, spam
Requires at least: 4.5
Tested up to: 5.5.1
Stable tag: 1.2.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Displays a listing of posts sortable by ShuffleJS.

== Changelog ==

= 1.2.5 =
* Removing title's ellipsis from the front of the flip cards.

= 1.2.4 =
* BUGFIX: Respecting order of `post__in` attribute for `[postfilter post__in="..." /]`.

= 1.2.3 =
* Adding `include_all` attribute to `[postfilter/]` for including all other posts when using `post__in`.

= 1.2.2 =
* Flip Card back styling for 2nd line ellipsis on heading, and 8th line ellipsis on the excerpt.

= 1.2.1 =
* Styling adjustments to [postfilter /] filter buttons.

= 1.2.0 =
* Adding `post__in` attribute to specify the complete set and order of posts displayed by `[postfilter /]`.

= 1.1.5 =
* Initializing variable and checking for varilable in `lib/fns/shortcodes.php`.

= 1.1.4 =
* Adding "Virtual" to label for "OpenClass" classes.

= 1.1.3 =
* Removing borders around flip cards.
* Adding `show_filters` attribute to `[postfilter]` shortcode.

= 1.1.2 =
* Bug Fix: Using single quotes for product dataGroup attribute.
* Refactoring post meta data.

= 1.1.1 =
* Updating Course meta color to Netmind blue.

= 1.1.0 =
* Adding Course meta to course products.
* Adding "New" tag to courses <= 90 days old.
* Adding "flip card" animation to course products.

= 1.0.0 =
* Updating `exclude` attribute to only remove the filter buttons from the ShuffleJS filter rather than removing the items from the query.

= 0.1.0 =
* Initial release.
