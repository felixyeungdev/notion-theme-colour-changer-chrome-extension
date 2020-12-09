(() => {
    // ClassWatcher from https://stackoverflow.com/a/53914092/13121213
    class ClassWatcher {
        constructor(
            targetNode,
            classToWatch,
            classAddedCallback,
            classRemovedCallback
        ) {
            this.targetNode = targetNode;
            this.classToWatch = classToWatch;
            this.classAddedCallback = classAddedCallback;
            this.classRemovedCallback = classRemovedCallback;
            this.observer = null;
            this.lastClassState = targetNode.classList.contains(
                this.classToWatch
            );

            this.init();
        }

        init() {
            this.observer = new MutationObserver(this.mutationCallback);
            this.observe();
        }

        observe() {
            this.observer.observe(this.targetNode, { attributes: true });
        }

        disconnect() {
            this.observer.disconnect();
        }

        mutationCallback = (mutationsList) => {
            for (let mutation of mutationsList) {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    let currentClassState = mutation.target.classList.contains(
                        this.classToWatch
                    );
                    if (this.lastClassState !== currentClassState) {
                        this.lastClassState = currentClassState;
                        if (currentClassState) {
                            this.classAddedCallback();
                        } else {
                            this.classRemovedCallback();
                        }
                    }
                }
            }
        };
    }

    const notionWhite = "#ffffff";
    const notionDark = "#2f3437";
    const notionDarkThemeClass = "notion-dark-theme";
    var theme = (color) => `<meta name="theme-color" content="${color}" />`;

    function createThemeColorMeta() {
        const themeColorMeta = document.createElement("meta");
        themeColorMeta.name = "theme-color";
        document.head.append(themeColorMeta);
        return themeColorMeta;
    }

    function isDarkMode() {
        try {
            return !!document
                .querySelector("#notion-app")
                .querySelector(`.${notionDarkThemeClass}`);
        } catch (error) {
            return false;
        }
    }

    function changeTheme() {
        var existingThemeColorMeta = document.querySelector(
            'meta[name="theme-color"]'
        );
        if (!existingThemeColorMeta) {
            existingThemeColorMeta = createThemeColorMeta();
        }
        const theme = isDarkMode() ? notionDark : notionWhite;
        existingThemeColorMeta.content = theme;
    }

    changeTheme();
    let classWatcher = new ClassWatcher(
        document.querySelector("#notion-app").children[0],
        notionDarkThemeClass,
        changeTheme,
        changeTheme
    );
})();
