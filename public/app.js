document.addEventListener("click", (event) => {

  const edit_BTN = event.target.closest(".edit-btn");
  const cancel_BTN = event.target.closest(".cancel-btn");


  if (!edit_BTN && !cancel_BTN) {
    return;
  }

  const item = event.target.closest("li");
  const editing = Boolean(edit_BTN);

  if (cancel_BTN) {
    item.querySelector(".edit-form").reset();
  }

  item.querySelector(".view").hidden = editing;
  item.querySelector(".edit-form").hidden = !editing;

  if(editing){
    item.querySelector(".edit-form input").focus()
  }else{
    item.querySelector(".edit-btn").focus()
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest(".edit-form");


  if (!form) {
    return;
  }

  event.preventDefault();

  const id = form.closest("li").dataset.id;
  const body = {
    listing: form.elements.listing.value,
    amount: Number(form.elements.amount.value),
    description: form.elements.description.value,
  };

  try {
    const response = await fetch("/listings/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(body),
    });

    if (response.ok) {
      sessionStorage.setItem("focusListing", id)
      window.location.reload();
      return;
    }

    const text = await response.text();

    alert(text);
  } catch (error) {
    alert("Server not reached");
  }
});

const savedId = sessionStorage.getItem("focusListing")
if(savedId){
  sessionStorage.removeItem("focusListing")
  const savedButton= document.querySelector('li[data-id="' + savedId + '"] .edit-btn')
  if(savedButton){
    savedButton.focus()
  }
}

document.addEventListener("htmx:beforeSwap", (event)=>{
  if(!event.detail.shouldSwap){
    return
  }
  const item = event.detail.target
  const near = item.nextElementSibling || item.previousElementSibling

  // ---------------
  // A neighbour may belong to someone else and have no Delete button, and a
  // logged-out page has no add form, so fall back step by step.
  const next =
    near?.querySelector(".delete-btn") ||
    near?.querySelector("h2") ||
    document.querySelector('input[name="listing"]') ||
    document.querySelector("main h1")
  if(next && !next.hasAttribute("tabindex") && !next.matches("button, input")){
    next.setAttribute("tabindex", "-1")
  }
  setTimeout(()=>next?.focus(), 0)
  // ---------------
})
