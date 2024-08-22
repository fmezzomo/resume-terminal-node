document.addEventListener("DOMContentLoaded", () => {
    const terminal = document.getElementById("terminal");
    const closeBtn = document.getElementById("close-btn");
    const minimizeBtn = document.getElementById("minimize-btn");
    const maximizeBtn = document.getElementById("maximize-btn");
    const darkThemeBtn = document.getElementById("dark-theme-btn");
    const lightThemeBtn = document.getElementById("light-theme-btn");
    const output = document.getElementById("output");

    let currentTheme = "dark"; // Initialize with the dark theme
    let isMaximized = false;
    let isMinimized = false;

    let commandData = {};
    let availableCommands = [];

    const commands = {
        help: () => `Available commands: ${availableCommands.join(", ")}, clear, theme [dark, light]`,
        clear: () => { print('', true); return ""; },
        list: (args) => {
            const category = args[0];
            if (commandData.hasOwnProperty(category)) {
                return formatList(commandData[category]);
            } else {
                return "Invalid list command. Use 'list email', 'list skills', 'list languages', 'list jobs', or 'list education'.";
            }
        },
        theme: (args) => {
            const theme = args[0];
            switch (theme) {
                case "dark":
                    if (currentTheme !== "dark") {
                        applyTheme("dark");
                        return "Switched to Dark Theme.";
                    } else {
                        return "Already using Dark Theme.";
                    }
                case "light":
                    if (currentTheme !== "light") {
                        applyTheme("light");
                        return "Switched to Light Theme.";
                    } else {
                        return "Already using Light Theme.";
                    }
                default:
                    return "Invalid theme command. Use 'theme dark' or 'theme light'.";
            }
        }
    };

    function formatList(data) {
        if (Array.isArray(data)) {
            return '- ' + data.join('\n- ');
        }
        return data;
    }

    function applyTheme(theme) {
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(`${theme}-theme`);
        currentTheme = theme;
    }

    // Initialize with the dark theme
    applyTheme("dark");

    function showHelp() {
        const result = commands.help();
        print(`${result}\n`);
    }

    function print(content, clear = false) {
        if (clear) {
            output.innerHTML = `${content}\n`;
        } else {
            output.innerHTML += `${content}\n`;
        }
    }

    function loadCommandData() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                commandData = data;
                availableCommands = Object.keys(commandData).map(cmd => `list ${cmd}`);
                showHelp();
            })
            .catch(error => console.error('Error loading command data:', error));
    }

    loadCommandData();

    closeBtn.addEventListener("click", () => {
        terminal.style.display = "none";
    });

    minimizeBtn.addEventListener("click", () => {
        if (!isMinimized) {
            terminal.classList.add("minimized");
            isMinimized = true;
            isMaximized = false;
        }
        output.scrollTop = output.scrollHeight;
    });

    maximizeBtn.addEventListener("click", () => {
        if (!isMaximized) {
            terminal.classList.remove("minimized");
            terminal.classList.add("maximized");
            isMaximized = true;
            isMinimized = false;
        } else {
            terminal.classList.remove("maximized");
            isMaximized = false;
        }
        output.scrollTop = output.scrollHeight;
    });

    darkThemeBtn.addEventListener("click", () => {
        if (currentTheme !== "dark") {
            applyTheme("dark");
        }
    });

    lightThemeBtn.addEventListener("click", () => {
        if (currentTheme !== "light") {
            applyTheme("light");
        }
    });

    const input = document.getElementById("input");

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const inputValue = input.value.trim();
            const [command, ...args] = inputValue.split(" ");

            if (commands.hasOwnProperty(command) && typeof commands[command] === "function") {
                const result = commands[command](args);
                print(`> ${inputValue}\n${result}\n`);
            } else {
                print(`> ${inputValue}\nCommand not found: ${command}\n`);
            }

            input.value = "";
            output.scrollTop = output.scrollHeight;
        }
    });
});
