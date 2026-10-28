document.addEventListener("click", async (event) => {
  const button = event.target.closest(".delete-btn");


  if (!button) {
    return;
  }
  const item = button.closest("li");
  const id = item.dataset.id;
  if (!confirm("Are you sure you want to delete your listing?")) {
    return;
  }
  try{
    const response = await fetch("/listings/" + id, { method: "DELETE" });
    if (response.status === 204) {
      window.location.reload();
      return
    }
    const text = await response.text()
    alert(text || "Deletion not completed.")


  }catch(error){
    alert("Server not reached")
  }



});

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
      window.location.reload();
      return;
    }

    const text = await response.text();

    alert(text);
  } catch (error) {
    alert("Server not reached");
  }
});
