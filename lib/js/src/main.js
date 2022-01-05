import PostFilters from './shufflejs-init'

const filters = new PostFilters()

/**
 * Handle the submission of the newsletter sign up form by hiding
 * the form after the submission and displaying the confirmation message.
 */
var newsletterForm = document.getElementById(`newslettersignup`);
if( newsletterForm && newsletterForm.addEventListener ){
  newsletterForm.addEventListener('submit', function(){
    console.log(`🔔 form has been submitted`);
    newsletterForm.style.display = 'none';
    var parent = newsletterForm.parentNode;
    parent.innerHTML = parent.innerHTML + `<p>${wpvars.confirmationMessage}</p>`;
  }, false );
}

/**
 * Redraw the Post Grid after the Newsletter Sign Up form has rendered its contents.
 *
 * We redraw the Post Grid because the Newsletter Sign Up form
 * can change its size based on things like a Google reCAPTCHA
 * field not being rendered when ShuffleJS is initially drawing
 * the Post Grid.
 *
 * IMPORTANT: In order for the following to work, we must set
 * the ID for the reCAPTCHA to `pardot_recaptcha`.
 */
window.setTimeout(function(){
  // Render Google reCAPTCHA if it hasn't been rendered:
  try{
    const recaptchaEl = document.querySelector('#form-field-pardot_recaptcha .elementor-g-recaptcha');
    grecaptcha.render( recaptchaEl );
  } catch (error) {
    console.log('🔔 Google reCAPTCHA already rendered in this element.' )
  }

  // Redraw the Post Grid and account for the height of the Newsletter Sign Up form
  const formElParent = document.querySelector('#post-grid li.post:nth-child(3)');
  if( formElParent.classList.contains('newsletter-signup') ){
    const formEl = document.querySelector('#post-grid li.post:nth-child(3) .elementor-location-single');
    const formElHeight = formEl.offsetHeight;
    formElParent.style.height = (formElHeight + 30) + 'px';
    console.log(`🔔 Updating newsletter parent height to ${formElHeight}px and redrawing...`);
    filters.shuffle.update();
  }
},1500);