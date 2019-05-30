https://jandem.github.io/diswasm/

# Notes

objdump from Binutils compiled to WebAssembly using Emscripten.

Build instructions on OS X for Binutils 2.32:
```
mkdir build
cd build
emconfigure ../configure --disable-debug --disable-dependency-tracking --disable-werror --enable-multilib --enable-targets=all --disable-nls --disable-gdb --disable-libdecnumber --disable-readline --disable-sim --enable-shared
emmake make -j8
emcc -Oz binutils/.libs/objdump bfd/libbfd.a opcodes/libopcodes.a libiberty/libiberty.a zlib/libz.a -s INVOKE_RUN=0 -s FORCE_FILESYSTEM=1 -o objdump.js
```

Doing it like this requires some hand holding of the build system:

* Conflicting types for `psignal` in libiberty/strsignal.c. Worked around with `#if 0` in that file.
* It tries to execute bfd/doc/chew. Replaced with a `#!/bin/bash` executable bash file to continue.
* Some symbols like `optind` exist in libc, resulting in duplicate symbols. Worked around by #ifdef'ing the affected names in the binutils sources.
* opcodes/s390-opc.tab and binutils/sysroff.h were copied from a native build instead of generating them.
