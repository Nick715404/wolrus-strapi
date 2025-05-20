export default {
  bootstrap(app: any) {
    app.injectContentManagerComponent("listView", "actions", {
      name: "ExportButton",
      Component: () => {
        const location = window.location.pathname;
        const collections = [
          "biznes-konferencziya",
          "faith-conf",
          "fire-chel",
          "youth-mgn",
        ];

        const isTargetPage = collections.some((collection) =>
          location.includes(
            `/content-manager/collection-types/api::${collection}.${collection}`
          )
        );

        if (!isTargetPage) return null;

        const actionsContainer = document.querySelector(
          ".sc-bdvvtL.sc-gsDKAQ.bOQZK.cDqAlZ"
        );

        if (actionsContainer && !document.querySelector("#exportButton")) {
          const button = document.createElement("button");
          button.textContent = "Экспортировать в Excel";
          button.style.marginLeft = "10px";
          button.style.padding = "8px 12px";
          button.style.backgroundColor = "#4A90E2";
          button.style.color = "white";
          button.style.border = "none";
          button.style.borderRadius = "4px";
          button.style.cursor = "pointer";

          button.id = "exportButton";

          button.addEventListener("click", () => {
            const collectionName = collections.find((collection) =>
              location.includes(collection)
            );
            window.open(`/api/${collectionName}/export`, "_blank");
          });

          actionsContainer.appendChild(button);
        }
      },
    });
  },
};
