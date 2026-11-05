import { privileges } from "./wishlist-data.js";

export function createPrivilegeCards() {
  const template = document.querySelector("#privilege-card-template");
  const printArea = document.querySelector("#privilege-print");

  function card(name) {
    const article = template.content.firstElementChild.cloneNode(true);
    article.querySelector("h3").textContent = name;
    return article;
  }

  function clearPrint() {
    delete document.body.dataset.print;
    printArea.replaceChildren();
  }

  function printCards(names) {
    printArea.replaceChildren(...names.map(card));
    document.body.dataset.print = "privileges";
    window.print();
  }

  function printButton(label, names) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "print-button";
    button.textContent = label;
    button.addEventListener("click", () => printCards(names));
    return button;
  }

  window.addEventListener("afterprint", clearPrint);

  return {
    clearPrint,
    render() {
      const wrapper = document.createElement("div");
      wrapper.append(printButton("Print all cards", privileges));
      const stack = document.createElement("div");
      stack.className = "privilege-stack";
      for (const name of privileges) {
        const article = card(name);
        const button = printButton("Print this card", [name]);
        button.setAttribute("aria-label", `Print card: ${name}`);
        article.append(button);
        stack.append(article);
      }
      wrapper.append(stack);
      return wrapper;
    },
  };
}
