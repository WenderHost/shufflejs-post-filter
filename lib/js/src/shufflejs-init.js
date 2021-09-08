import Shuffle from 'shufflejs'
import { truncate, explode } from './utilities'

const browserWidth = window.innerWidth
console.log(`🔔 browserWidth = ${browserWidth}`)
const mobileBreakPoint = wpvars.mobileBreakPoint

class PostFilters {
  constructor(){
    let urlParams = new URLSearchParams(window.location.search)

    let subCategoryStr = urlParams.get('sub-category')
    this.subCategoryArray = []
    if( null != subCategoryStr ){
      if( -1 < subCategoryStr.indexOf(',') ){
        this.subCategoryArray = explode(',', subCategoryStr)
      } else {
        this.subCategoryArray = [ subCategoryStr ]
      }
    }

    let certificationStr = urlParams.get('certification')
    this.certificationArray = []
    if( null != certificationStr ){
      if( -1 < certificationStr.indexOf(',') ){
        this.certificationArray = explode(',', certificationStr)
      } else {
        this.certificationArray = [ certificationStr ]
      }
    }

    let newsCategoryStr = urlParams.get('news-category')
    this.newsCategoryArray = []
    if( null != newsCategoryStr ){
      if( -1 < newsCategoryStr.indexOf(',') ){
        this.newsCategoryArray = explode(',', newsCategoryStr)
      } else {
        this.newsCategoryArray = [ newsCategoryStr ]
      }
    }

    this.filters = []
    this.postType = wpvars.post_type
    this.category = wpvars.category
    this.gridId = wpvars.gridId

    const allPosts = wpvars.posts
    if( mobileBreakPoint >= browserWidth && 'post' == wpvars.post_type ){
      console.log(`🔔 Removing Newsletter Sign Up form because browser width is <= ${mobileBreakPoint}`)
      allPosts.splice(2,1)
    }

    this.posts = allPosts
    this.defaultThumbnail = wpvars.defaultThumbnail
    this.filterClassName = wpvars.filter_class_name
    this.page_number = 1
    this.page_size = parseInt(wpvars.limit)
    if( -1 === this.page_size ){
      this.total_pages = 1
    } else {
      if( this.posts.length )
        this.total_pages = Math.ceil( this.posts.length/this.page_size )
    }
    this.filterGroups = document.getElementsByClassName( wpvars.filter_class_name )
    this.loadMoreButton = document.getElementById('load-more')
    this.loadPosts()
    this.addLinkEventListener()
    this.addLoadMoreListener()
    this.initializeFilterGroups()
    if( 0 < this.subCategoryArray.length || 0 < this.certificationArray.length || 0 < this.newsCategoryArray.length )
      this.deepLink()
  }

  /**
   * Enables the functionality of the LOAD MORE button
   */
  addLoadMoreListener(){
    this.loadMoreButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.clearAllFilters() // We need to clear all filters, otherwise the first position in the list of posts is empty.
      this.initializeFilterGroups() // Adds .select to the "All" filter
      this.shuffle.filter()
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
            link.classList.add('selected')
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
        filterLink[0].classList.remove('selected')
        const filterToRemove = filterLink[0].getAttribute('data-filter')
        this.removeFilter(filterToRemove)
      }
    }
    this.applyFilters()
  }

  /**
   * Permits linking to Sub Categories and Certifications via the URL query string.
   *
   * - sub-category   Comma separated list of Sub Category slugs.
   * - certification  Comma separated list of Certification slugs.
   */
  deepLink(){
    console.log('🔔 Deep Linking...')
    if( 0 < this.subCategoryArray.length ){
      this.subCategoryArray.forEach( element => {
        this.addFilter(element)
        // Remove .selected from the filter anchor tag.
        var filterLink = document.querySelector(`[data-filter="${element}"]`)
        if( ! filterLink.classList.contains('selected') )
          filterLink.classList.add('selected')
      })
      let subCategoryLinks = document.getElementsByClassName( 'sub_category' )
      for( let [key,value] of Object.entries(subCategoryLinks) ){
        const filterLinks = value.getElementsByTagName('a')
        filterLinks[0].classList.remove('selected')
      }
    }

    if( 0 < this.certificationArray.length ){
      this.certificationArray.forEach( element => {
        this.addFilter(element)
        // Remove .selected from the filter anchor tag.
        var filterLink = document.querySelector(`[data-filter="${element}"]`)
        if( ! filterLink.classList.contains('selected') )
          filterLink.classList.add('selected')
      })
      let certificationLinks = document.getElementsByClassName( 'certification' )
      for( let [key,value] of Object.entries(certificationLinks) ){
        const filterLinks = value.getElementsByTagName('a')
        filterLinks[0].classList.remove('selected')
      }
    }

    if( 0 < this.newsCategoryArray.length ){
      this.newsCategoryArray.forEach( element => {
        this.addFilter(element)
        // Remove .selected from the filter anchor tag.
        var filterLink = document.querySelector(`[data-filter="${element}"]`)
        if( ! filterLink.classList.contains('selected') )
          filterLink.classList.add('selected')
      })
      let newsCategoryLinks = document.getElementsByClassName( 'news_category' )
      for( let [key,value] of Object.entries(newsCategoryLinks) ){
        const filterLinks = value.getElementsByTagName('a')
        filterLinks[0].classList.remove('selected')
      }
    }

    this.applyFilters()

    // Smooth Scoll to "Sub Categories"
    var el = document.getElementById('shuffleFilterTop')
    var viewportOffset = el.getBoundingClientRect()
    var top = viewportOffset.top
    window.scroll({top: (top - 90),left: 0, behavior: 'smooth'})
    console.log('top = ', top)
    console.log('🔔 did we scroll?')
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
   * Initializes the filter groups by adding `.selected` to the first filter.
   */
  initializeFilterGroups(){
    for( let [key,value] of Object.entries(this.filterGroups) ){
      const filterLinks = value.getElementsByTagName('a')
      filterLinks[0].classList.add('selected')
    }
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

        //console.log('Shuffling now! this.page_number = ', this.page_number)

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
        var newTag = ( el.new )? '<div class="new"></div>' : ''

        post = `
        <li class="list-item ${this.postType}" data-groups='${JSON.stringify(el.groups)}'>
          <a href="${el.permalink}">
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <div class="course-title">
                    <h3>${el.title}</h3>
                    ${newTag}
                  </div>
                  <div class="course-meta">
                    <div class="course-meta-row">
                      <div class="course-meta-col">
                        <div class="icon duration"></div>
                        <div class="text">${el.meta.course_duration}</div>
                      </div>
                      <div class="course-meta-col">
                        <div class="text">${el.meta.course_reference}</div>
                      </div>
                    </div>
                    <div class="course-meta-row">
                      <div class="course-meta-col ${el.meta.face_to_face}">
                        <div class="icon face-to-face ${el.meta.face_to_face}"></div>
                        <div class="text">${wpvars.labels.faceToFace}</div>
                      </div>
                      <div class="course-meta-col ${el.meta.virtual}">
                        <div class="icon virtual ${el.meta.virtual}"></div>
                        <div class="text"><span>Virtual<br/>OpenClass&reg;</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flip-card-back">
                  <h3>${el.title}</h3>
                  <p>${el.excerpt}</p>
                </div>
              </div>
            </div>
          </a>
        </li>`
        break

      default:
        //if( 'newsletter_form' == el.title && 375 = browserWidth )
        // CONTINUE WITH ABOVE STATEMENT

        // Build the elements of .overlay
        let ribbon = `<div class="ribbon ${el.groups.join(' ')}"></div>`
        let blueOverlay = `<div class="blue-overlay"></div>`

        let categoryOverlay = `<div class="category-overlay">${el.resource_type}</div>`
        if( 'news' == wpvars.category ){
          categoryOverlay = `<div class="category-overlay">${el.news_category}</div>`
        }

        // .overlay contains .ribbon, .blue-overlay, and .category-overlay
        let overlay = `<div class="overlay" style="background-image: url('${thumbnailUrl}')">${ribbon}${blueOverlay}${categoryOverlay}</div>`

        // Build .list-item with the .meta and title.
        let meta = `<p class="meta">${el.meta}</p>`
        if( 'news' == wpvars.category )
          meta = ''
        let title = `<h3 class="">${truncate(el.title,80,true)}</h3>`
        let listItem = `<li class="list-item ${wpvars.category} ${this.postType}" data-groups='${JSON.stringify(el.groups)}'><a href="${el.permalink}"><div class="list-content ${this.postType}">${overlay}${meta}${title}</div></a></li>`
        if( 'newsletter_form' == el.title ){
          listItem = `<li class="list-item ${this.postType} newsletter-signup" data-groups="[]"><div class="list-content ${this.postType}">${wpvars.newsletterForm}</div></li>`
        }
        post = listItem
    }
    return post
  }
}

export default PostFilters