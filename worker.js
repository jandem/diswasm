var Module = {};
Module.print = Module.printErr = function(s) {
    if (s.includes("file format binary") ||
        s.includes("Disassembly of section") ||
        s.includes(" <.data>:") ||
        s.includes("unrecognised disassembler option:") ||
        s.trim().length === 0) {
        return;
    }
    postMessage({id:"output", data:s})
}

importScripts("module.js");

Module.onRuntimeInitialized = function() {
    postMessage({id:"ready"});
};

onmessage = function(e) {
    if (e.data.id === "disassemble") {
        var input = e.data.input;
        var parts = input.split(/\s+/);
        var arr = [];
        for (var p of parts) {
            if (p.length > 0) {
                arr.push(parseInt("0x" + p));
            }
        }
        try {
            Module.FS_unlink("/input");
        } catch(e) {}
        Module.FS_createDataFile("/", "input", arr, true, true);
        Module.arguments.push(...e.data.cmd.split(" "));
        Module.arguments.push("input", "-D");
        Module.callMain(Module.arguments);
    }
};
