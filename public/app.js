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

  let next
  if(near){
    next =near.querySelector(".delete-btn")

  }else{
    next = document.querySelector('input[name="listing"]')
  }
  setTimeout(()=>next.focus(), 0)
})
