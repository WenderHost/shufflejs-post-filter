import Shuffle from 'shufflejs'
import { truncate } from './utilities'

class PostFilters {
  constructor(){
    console.log('PostFilters is loaded.')

    this.filters = []

    this.postType = wpvars.post_type
    this.category = wpvars.category
    this.gridId = wpvars.gridId
    this.posts = wpvars.posts
    this.defaultThumbnail = wpvars.defaultThumbnail
    this.filterClassName = wpvars.filter_class_name
    this.page_number = 1
    this.page_size = parseInt(wpvars.limit)
    console.log('this.page_size = ', this.page_size)
    this.total_pages = ( -1 === this.page_size )? 1 : Math.ceil( this.posts.length/this.page_size )
    this.filterGroups = document.getElementsByClassName( wpvars.filter_class_name )
    this.loadMoreButton = document.getElementById('load-more')
    this.loadPosts()
    this.addLinkEventListener()
    //document.querySelector('#load-more').addEventListener('click', this.onAppendPosts.bind(this) )
    this.addLoadMoreListener()

    console.log('this.postType = ', this.postType,"\n" + 'this.category = ', this.category, "\n" + 'this.gridId = ', this.gridId, "\nthis.posts = ", this.posts, "\nthis.defaultThumbnail = ", this.defaultThumbnail, "\nthis.filterClassName = ", this.filterClassName, "\nthis.total_pages = ", this.total_pages )
  }

  /**
   * Enables the functionality of the LOAD MORE button
   */
  addLoadMoreListener(){
    this.loadMoreButton.addEventListener('click', (event) => {
      event.preventDefault()
      this.loadPosts()
    })
  }

  /**
   * Adds event listener to each .filter-link-group ul > li > a
   */
  addLinkEventListener(){
    for( let [key,value] of Object.entries(this.filterGroups)){
      const filterLinks = value.getElementsByTagName('a')
      for( let [key,link] of Object.entries(filterLinks)){
        const filter = link.getAttribute('data-filter')
        link.addEventListener('click',(event) => {
          event.preventDefault()

          if( 'groups' !== Shuffle.FILTER_ATTRIBUTE_KEY ){
            this.clearAllFilters()
            Shuffle.FILTER_ATTRIBUTE_KEY = 'groups'
          }

          // Clear the text search field
          //this.removeSearchText()

          // Remove all filtering for a taxonomy if '*' === filter
          if( '*' === filter ){
            this._clearAllFiltersForTaxonomy(link)
          } else {
            this._clearAllFiltersForTaxonomy(link)
            this.toggleFilter(filter)
            if( this.hasFilter(filter) ){
              link.classList.add('selected')
            } else {
              //this._clearAllFiltersForTaxonomy(link)
              link.classList.remove('selected')
            }
          }
          /**/
        })
      }
    }
  }

  /**
   * Adds a `filter` to this.filters
   *
   * @param      {string}  filter  The filter
   */
  addFilter( filter ){
    if( -1 === this.filters.indexOf(filter) ){
      this.filters.push(filter)
    }
  }

  /**
   * Calls ShuffleJS.shuffle with our filters
   */
  applyFilters(){
    var filters = this.filters
    console.log('🔔 Filtering with: ', filters )
    this.shuffle.filter( filters )
  }

  clearAllFilters(){
    const filters = this.filters
    filters.forEach((element) => {
      this.removeFilter(element)
    })
  }

  _clearAllFiltersForTaxonomy( linkEl ){
    const closestParent = linkEl.closest('.filter-link-group')
    const taxonomy = closestParent.getAttribute('data-taxonomy')
    const listItems = closestParent.getElementsByTagName('li')
    console.log(`🔔 Clearing all filters for "${taxonomy}"...`)
    for( let [key,listItem] of Object.entries(listItems)){
      const filterLink = listItem.getElementsByTagName('a')
      if( filterLink[0].classList.contains('selected') ){
        const filterToRemove = filterLink[0].getAttribute('data-filter')
        this.removeFilter(filterToRemove)
      }
    }
    this.applyFilters()
  }

   /**
   * Checks for the existence of `filter` inside this.filters
   *
   * @param      {string}   filter  The filter
   * @return     {boolean}  True if has filter, False otherwise.
   */
  hasFilter( filter ){
    return (-1 < this.filters.indexOf(filter))? true : false
  }

  /**
   * Removes a `filter` from this.filters
   *
   * @param      {string}  filter  The filter
   */
  removeFilter( filter ){
    var index = this.filters.indexOf(filter)
    if(-1 < index){
      console.log(`\t • Removing '${filter}'`)
      this.filters.splice(index,1)

      // Remove .selected from the filter anchor tag.
      var filterLink = document.querySelector(`[data-filter="${filter}"]`)
      if( filterLink.classList.contains('selected') )
        filterLink.classList.remove('selected')
    }
  }

  /**
   * Toggles (adds/removes) a `filter` from this.filters
   *
   * @param      {string}  filter  The filter
   */
  toggleFilter( filter ){
    const hasFilter = this.hasFilter( filter )
    if( hasFilter ){
      this.removeFilter(filter)
    } else {
      this.addFilter(filter)
    }
    this.applyFilters()
  }

  /**
   * Loads our posts and applies ShuffleJS
   *
   * @param      {number}  page_size    The page size
   * @param      {number}  page_number  The page number
   */
  loadPosts(){
    const postGrid = document.getElementById( this.gridId )

    const posts = ( -1 === this.page_size )? this.posts : this._getPageOfPosts()

    let elProcessed = 0
    posts.forEach( (el, index, array) => {
      postGrid.insertAdjacentHTML('beforeEnd', this._getPostElement(el) )
      elProcessed++
      if( elProcessed === array.length ){

        console.log('Shuffling now! this.page_number = ', this.page_number)

        if( this.page_number === this.total_pages || -1 === this.page_size )
          this.loadMoreButton.style.display = 'none'

        this.page_number++
        this.shuffle = new Shuffle( document.getElementById( this.gridId ), {
          itemSelector: '.' + this.postType,
          filterMode: 'all'
        })
      }
    })
  }

  _getPageOfPosts(){
    console.log(`_getPageOfPosts() is retrieving page ${this.page_number} with ${this.page_size} posts.`)
    let page_number = this.page_number
    page_number--
    const page_size = this.page_size
    return this.posts.slice( page_number * page_size, (page_number + 1) * page_size )
  }

  /**
   * Returns the HTML for our post element.
   *
   * @param {object} el Our post element/object.
   */
  _getPostElement( el ){
    const thumbnailUrl = ( ! el.thumbnail )? this.defaultThumbnail : el.thumbnail ;
    let post = ''
    switch( this.postType ){
      case 'product':
        post = '<li class="list-item ' + this.postType + '" data-groups=\'' + JSON.stringify(el.groups) + '\'><div class="list-content ' + this.postType + '"><h3><a href="' + el.permalink + '">' + truncate( el.title, 50, true ) + '</a></h3><div><a class="button" href="' + el.permalink + '">View the Course</a></div></div></li>'
        break

      default:
        post = '<li class="list-item ' + this.postType + '" data-groups=\'' + JSON.stringify(el.groups) + '\'><div class="list-content ' + this.postType + '"><div class="overlay"><img src="' + thumbnailUrl + '" alt="' + el.esc_title + '" /></div><p class="meta">' + el.meta + '</p><h3><a href="' + el.permalink + '">' + truncate( el.title, 80, true ) + '</a></h3></div></li>'
    }
    return post
  }
}

export default PostFilters