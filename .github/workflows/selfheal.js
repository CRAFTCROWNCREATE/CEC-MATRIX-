// --- CEC-WAM SELF-HEAL MODULE ---
// Prevents duplicate declarations and auto-recovers from global errors

(function(){
    const declared = new Set();

    window.safeDeclare = function(name, value) {
        if (declared.has(name)) {
            console.warn("SELF-HEAL: '" + name + "' already declared. Skipping.");
            return window[name];
        } else {
            declared.add(name);
            window[name] = value;
            console.log("SELF-HEAL: Declared '" + name + "'");
            return value;
        }
    };

    window.onerror = function(message, source, lineno, colno, error) {
        if (message.includes("already been declared")) {
            console.warn("SELF-HEAL: Duplicate detected. Reloading...");
            setTimeout(() => location.reload(), 1500);
            return true;
        }
        return false;
    };

    console.log("SELF-HEAL MODULE ACTIVE");
})();
