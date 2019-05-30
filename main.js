  var worker = null;
  var ready = false;

  window.onload = function() {
      worker = new Worker("worker.js");
      worker.onmessage = function(e) {
          switch (e.data.id) {
          case "ready":
              ready = true;
              disassemble();
              break;
          case "output":
              handleOutput(e.data.data);
              break;
          }
      }

      // From objdump --help, with duplicate wasm32 removed.
      var allArchs = "aarch64 aarch64:ilp32 alpha alpha:ev4 alpha:ev5 alpha:ev6 ARC600 A6 ARC601 ARC700 A7 ARCv2 EM HS arm armv2 armv2a armv3 armv3m armv4 armv4t armv5 armv5t armv5te xscale ep9312 iwmmxt iwmmxt2 armv5tej armv6 armv6kz armv6t2 armv6k armv7 armv6-m armv6s-m armv7e-m armv8-a armv8-r armv8-m.base armv8-m.main arm_any avr avr:1 avr:2 avr:25 avr:3 avr:31 avr:35 avr:4 avr:5 avr:51 avr:6 avr:100 avr:101 avr:102 avr:103 avr:104 avr:105 avr:106 avr:107 bfin cr16 cr16c cris crisv32 cris:common_v10_v32 crx csky csky:ck510 csky:ck610 csky:ck801 csky:ck802 csky:ck803 csky:ck807 csky:ck810 csky:any d10v d10v:ts2 d10v:ts3 d30v dlx epiphany32 epiphany16 fr30 frv tomcat simple fr550 fr500 fr450 fr400 fr300 h8300 h8300h h8300s h8300hn h8300sn h8300sx h8300sxn hppa1.1 hppa2.0w hppa2.0 hppa1.0 i386 i386:x86-64 i386:x64-32 i8086 i386:intel i386:x86-64:intel i386:x64-32:intel i386:nacl i386:x86-64:nacl i386:x64-32:nacl iamcu iamcu:intel ia64-elf64 ia64-elf32 ip2022ext ip2022 iq2000 iq10 k1om k1om:intel l1om l1om:intel lm32 m16c m32c m32r m32rx m32r2 m68hc11 m68hc12 m68hc12 m9s12x m9s12xg s12z m68k m68k:68000 m68k:68008 m68k:68010 m68k:68020 m68k:68030 m68k:68040 m68k:68060 m68k:cpu32 m68k:fido m68k:isa-a:nodiv m68k:isa-a m68k:isa-a:mac m68k:isa-a:emac m68k:isa-aplus m68k:isa-aplus:mac m68k:isa-aplus:emac m68k:isa-b:nousp m68k:isa-b:nousp:mac m68k:isa-b:nousp:emac m68k:isa-b m68k:isa-b:mac m68k:isa-b:emac m68k:isa-b:float m68k:isa-b:float:mac m68k:isa-b:float:emac m68k:isa-c m68k:isa-c:mac m68k:isa-c:emac m68k:isa-c:nodiv m68k:isa-c:nodiv:mac m68k:isa-c:nodiv:emac m68k:5200 m68k:5206e m68k:5307 m68k:5407 m68k:528x m68k:521x m68k:5249 m68k:547x m68k:548x m68k:cfv4e MCore mep h1 c5 metag MicroBlaze mips mips:3000 mips:3900 mips:4000 mips:4010 mips:4100 mips:4111 mips:4120 mips:4300 mips:4400 mips:4600 mips:4650 mips:5000 mips:5400 mips:5500 mips:5900 mips:6000 mips:7000 mips:8000 mips:9000 mips:10000 mips:12000 mips:14000 mips:16000 mips:16 mips:mips5 mips:isa32 mips:isa32r2 mips:isa32r3 mips:isa32r5 mips:isa32r6 mips:isa64 mips:isa64r2 mips:isa64r3 mips:isa64r5 mips:isa64r6 mips:sb1 mips:loongson_2e mips:loongson_2f mips:gs464 mips:gs464e mips:gs264e mips:octeon mips:octeon+ mips:octeon2 mips:octeon3 mips:xlr mips:interaptiv-mr2 mips:micromips mmix mn10200 mn10300 am33 am33-2 moxie ft32 ft32 ft32b msp:14 MSP430 MSP430x11x1 MSP430x12 MSP430x13 MSP430x14 MSP430x15 MSP430x16 MSP430x20 MSP430x21 MSP430x22 MSP430x23 MSP430x24 MSP430x26 MSP430x31 MSP430x32 MSP430x33 MSP430x41 MSP430x42 MSP430x43 MSP430x44 MSP430x46 MSP430x47 MSP430x54 MSP430X ms1 ms1-003 ms2 n1h n1h n1h_v2 n1h_v3 n1h_v3m NFP-6xxx NFP-32xx nios2 nios2:r1 nios2:r2 ns32k:32032 ns32k:32532 or1k or1knd pdp11 powerpc:common powerpc:common64 powerpc:603 powerpc:EC603e powerpc:604 powerpc:403 powerpc:601 powerpc:620 powerpc:630 powerpc:a35 powerpc:rs64ii powerpc:rs64iii powerpc:7400 powerpc:e500 powerpc:e500mc powerpc:e500mc64 powerpc:MPC8XX powerpc:750 powerpc:titan powerpc:vle powerpc:e5500 powerpc:e6500 pru riscv riscv:rv64 riscv:rv32 rl78 rs6000:6000 rs6000:rs1 rs6000:rsc rs6000:rs2 rx rx rx:v2 rx:v3 s390:31-bit s390:64-bit score7 score3 sh sh2 sh2e sh-dsp sh3 sh3-nommu sh3-dsp sh3e sh4 sh4a sh4al-dsp sh4-nofpu sh4-nommu-nofpu sh4a-nofpu sh2a sh2a-nofpu sh2a-nofpu-or-sh4-nommu-nofpu sh2a-nofpu-or-sh3-nommu sh2a-or-sh4 sh2a-or-sh3e sparc sparc:sparclet sparc:sparclite sparc:v8plus sparc:v8plusa sparc:sparclite_le sparc:v9 sparc:v9a sparc:v8plusb sparc:v9b sparc:v8plusc sparc:v9c sparc:v8plusd sparc:v9d sparc:v8pluse sparc:v9e sparc:v8plusv sparc:v9v sparc:v8plusm sparc:v9m sparc:v8plusm8 sparc:v9m8 spu:256K tms320c30 tms320c4x tms320c3x tms320c54x tic6x tic80 tilegx tilegx32 tilepro v850:old-gcc-abi v850e3v5:old-gcc-abi v850e2v4:old-gcc-abi v850e2v3:old-gcc-abi v850e2:old-gcc-abi v850e1:old-gcc-abi v850e:old-gcc-abi v850:rh850 v850e3v5 v850e2v4 v850e2v3 v850e2 v850e1 v850e v850-rh850 vax visium wasm32 xstormy16 xtensa xc16x xc16xl xc16xs xgate z80-any z80-strict z80 z80-full r800 z8001 z8002".split(" ").sort();

      var arch = document.getElementById("arch");
      var important = ["i386", "i386:x86-64", "aarch64", "arm", "mips", "wasm32"].sort();

      var addArch = (a, selected) => {
          var option = document.createElement("option");
          option.value = option.text = a;
          if (selected) {
              option.selected = true;
          }
          arch.add(option);
      };
      for (var a of important) {
          addArch(a, a === "i386:x86-64");
      }

      var option = document.createElement("option");
      option.value = "";
      option.text = "-----";
      arch.add(option);

      for (var a of allArchs) {
          addArch(a, false);
      }

      setCommand();
      
  };
  function handleOutput(s) {
      if (s.includes(":")) {
          var parts = s.split("\t", 3);
          if (parts.length === 3) {
              s = `<span class="addr">${parts[0]}</span>\t<span class="bytes">${parts[1]}</span>\t<span class="instr">${parts[2]}</span>`;
          }
      }
      document.getElementById("output").innerHTML += s + "<br>";
  }

  function setCommand() {
      var arch = document.getElementById("arch").value;
      if (arch === "") {
          return;
      }
      var base = document.getElementById("base").value;
      var s = `-b binary -m ${arch} --adjust-vma ${base}`;
      if (arch.includes("i386")) {
          document.getElementById("x86_fields").style.display = "block";
          s += " -M " + document.getElementById("x86_syntax").value;
      } else {
          document.getElementById("x86_fields").style.display = "none";
      }
      if (arch.includes("arm")) {
          document.getElementById("arm_fields").style.display = "block";
          if (document.getElementById("arm_thumb").checked) {
              s += " -M force-thumb";
          } else {
              s += " -M no-force-thumb";
          }
      } else {
          document.getElementById("arm_fields").style.display = "none";
      }
      document.getElementById("cmd").value = s;
      disassemble();
  }

  function disassemble() {
      if (!ready) {
          return;
      }
      document.getElementById("output").textContent = "";
      var cmd = document.getElementById("cmd").value;
      var input = document.getElementById("input").value;
      worker.postMessage({id:"disassemble", cmd: cmd, input: input});
  }
