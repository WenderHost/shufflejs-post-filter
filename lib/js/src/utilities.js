/* Utility Functions */

export function truncate( string, n, useWordBoundary ){
    if (string.length <= n)
      return string
    let subString = string.substr(0, n-1)
    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ') ) : subString) + "&hellip;"
}