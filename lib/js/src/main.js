import PostFilters from './shufflejs-init'

const filters = new PostFilters()

// Handle the submission of the newsletter sign up
// form by hiding the form after the submission and
// displaying the confirmation message.
var newsletterForm = document.getElementById(`newslettersignup`);
if( newsletterForm.addEventListener ){
  newsletterForm.addEventListener('submit', function(){
    console.log(`🔔 form has been submitted`);
    newsletterForm.style.display = 'none';
    var parent = newsletterForm.parentNode;
    parent.innerHTML = parent.innerHTML + `<p>${wpvars.confirmationMessage}</p>`;
  }, false );
}