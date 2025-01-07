import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  showSpinner(event) {
    // Show the spinner
    document.getElementById("spinner").classList.remove("hidden");
  }
}