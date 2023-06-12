// engine.js
const { Marp } = require('@marp-team/marp-core');
const Prism = require('prismjs');
const hljs = require('highlight.js');
const hljsDefineIECST = require('highlightjs-structured-text');
require('prismjs/components/prism-c');
require('prismjs/components/prism-clike');
require('prismjs/components/prism-cpp');

hljsDefineIECST(hljs);

const tokenizer2 = () => {
    // keywords
    const keywords = [
      'Reactor_prcl',
      'Terminal_prcl',
      'Shadow_prcl',
      'wString',
      'sString',
      'Log',
      'DeepEye',
      'Image',
      'Footage',
      'CodeMatrix',
      'Vector2u',
      'triplet',
      'TripletContainer',
      'abstract',
      'amp',
      'array',
      'auto',
      'bool',
      'break',
      'case',
      'catch',
      'char',
      'class',
      'const',
      'constexpr',
      'const_cast',
      'continue',
      'cpu',
      'decltype',
      'default',
      'delegate',
      'delete',
      'do',
      'double',
      'dynamic_cast',
      'each',
      'else',
      'enum',
      'event',
      'explicit',
      'export',
      'extern',
      'false',
      'final',
      'finally',
      'float',
      'for',
      'friend',
      'gcnew',
      'generic',
      'goto',
      'if',
      'in',
      'initonly',
      'inline',
      'int',
      'interface',
      'interior_ptr',
      'internal',
      'literal',
      'long',
      'mutable',
      'namespace',
      'new',
      'noexcept',
      'nullptr',
      '__nullptr',
      'operator',
      //'override',
      'partial',
      'pascal',
      'pin_ptr',
      'private',
      'property',
      'protected',
      'public',
      'ref',
      'register',
      'reinterpret_cast',
      'restrict',
      'return',
      'safe_cast',
      'sealed',
      'short',
      'signed',
      'sizeof',
      'static',
      'static_assert',
      'static_cast',
      'struct',
      'switch',
      'template',
      'this',
      'thread_local',
      'throw',
      'tile_static',
      'true',
      'try',
      'typedef',
      'typeid',
      'typename',
      'union',
      'unsigned',
      'using',
      'virtual',
      'void',
      'volatile',
      'wchar_t',
      'where',
      'while',

      '_asm', // reserved word with one underscores
      '_based',
      '_cdecl',
      '_declspec',
      '_fastcall',
      '_if_exists',
      '_if_not_exists',
      '_inline',
      '_multiple_inheritance',
      '_pascal',
      '_single_inheritance',
      '_stdcall',
      '_virtual_inheritance',
      '_w64',

      '__abstract', // reserved word with two underscores
      '__alignof',
      '__asm',
      '__assume',
      '__based',
      '__box',
      '__builtin_alignof',
      '__cdecl',
      '__clrcall',
      '__declspec',
      '__delegate',
      '__event',
      '__except',
      '__fastcall',
      '__finally',
      '__forceinline',
      '__gc',
      '__hook',
      '__identifier',
      '__if_exists',
      '__if_not_exists',
      '__inline',
      '__int128',
      '__int16',
      '__int32',
      '__int64',
      '__int8',
      '__interface',
      '__leave',
      '__m128',
      '__m128d',
      '__m128i',
      '__m256',
      '__m256d',
      '__m256i',
      '__m512',
      '__m512d',
      '__m512i',
      '__m64',
      '__multiple_inheritance',
      '__newslot',
      '__nogc',
      '__noop',
      '__nounwind',
      '__novtordisp',
      '__pascal',
      '__pin',
      '__pragma',
      '__property',
      '__ptr32',
      '__ptr64',
      '__raise',
      '__restrict',
      '__resume',
      '__sealed',
      '__single_inheritance',
      '__stdcall',
      '__super',
      '__thiscall',
      '__try',
      '__try_cast',
      '__typeof',
      '__unaligned',
      '__unhook',
      '__uuidof',
      '__value',
      '__virtual_inheritance',
      '__w64',
      '__wchar_t'
  ];
  const keywordPattern = new RegExp("\\b(?:" + keywords.join("|") + ")\\b");

  // boolean
  const booleanPattern = /\b(?:true|false)\b/;

  // operators
  const operators = [
      '=',
      '>',
      '<',
      '!',
      '~',
      '?',
      ':',
      '==',
      '<=',
      '>=',
      '!=',
      '&&',
      '||',
      '++',
      '--',
      '+',
      '-',
      '*',
      '/',
      '&',
      '|',
      '^',
      '%',
      '<<',
      '>>',
      '>>>',
      '+=',
      '-=',
      '*=',
      '/=',
      '&=',
      '|=',
      '^=',
      '%=',
      '<<=',
      '>>=',
      '>>>='
  ];
  const operatorPattern = "\\b(?:" + operators.join("|") + ")\\b";

  // strings OR characters
  const escapes = /\\(?:[0abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/;
  const characterORstringPattern = new RegExp(`(')(${escapes.source}|[^\\n']*)(')`, 'g');

  // numbers
  const integersuffix = /([uU](ll|LL|l|L)|(ll|LL|l|L)?[uU]?)/;
  const floatsuffix = /[fFlL]?/;
  // const encoding = /u|u8|U|L/;

  const numberIntegerPattern1 = new RegExp(`/\d[\d']*\d(${integersuffix.source})/`);
  const numberIntegerPattern2 = new RegExp(`/\d(${integersuffix.source})/`);
  const numberFloatPattern1 = new RegExp(`/\d*\d+[eE]([\-+]?\d+)?(${floatsuffix.source})/`);
  const numberFloatPattern2 = new RegExp(`/\d*\.\d+([eE][\-+]?\d+)?(${floatsuffix.source})/`);

  const numberHEXPattern = new RegExp(`/0[xX][0-9a-fA-F']*[0-9a-fA-F](${integersuffix.source})/`);
  const numberOCTAPattern = new RegExp(`/0[0-7']*[0-7](${integersuffix.source})/`);
  const numberBINPattern = new RegExp(`/0[bB][0-1']*[0-1](${integersuffix.source})/`);

  // anything other ("garbage")
  const fallbackPattern = /[\s\S]/;

  Prism.languages["cpp2"] = {
    'comment': 
        /[^\/*]+/   | 
        /\*\//      |
        /[\/*]/     |
        /.*[^\\]$/  |
        /[^]+/,
    'string': 
        /[^\\"]+/   |
        /\\./       |
        /"/         |
        /\\(?:[0abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    'character':
        /'[^\\']'/  |
        characterORstringPattern,
    'keyword':  keywordPattern,
    'boolean':  booleanPattern,
    // 'operator': new RegExp(operatorPattern),
    // 'number.float': 
    //     numberFloatPattern1 |
    //     numberFloatPattern2,
    // 'number.hex': numberHEXPattern,
    // 'number.octal': numberOCTAPattern,
    // 'number.binary': numberBINPattern,
    // 'number': 
    //     numberIntegerPattern1 |
    //     numberIntegerPattern2,
    // 'namespace' : /\bnamespace\s+\w+(\s*:\s*\w+)*\b/g,
    // 'directive': /^\s*#\s*\w+/,
    // 'brackets': /[{}()\[\]]/,
    // 'annotation': /\[\s*\[/,
    // 'fallback': fallbackPattern
  };

  // const code = "#include <iostream>\nint main(){\nint x = 5;\n}\n";

  Prism.languages["cpp2"].rest = {};

  // const tokens = Prism.tokenize(code, Prism.languages["cpp"]);
  // tokens.forEach(token => {
  //     console.log(token.type);
  // });
};

// const tokenizer = () => {
//   var keyword = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;
// 	var modName = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(/<keyword>/g, function () { return keyword.source; });

// 	Prism.languages["cpp2"] = Prism.languages.extend('c', {
// 		'class-name': [
// 			{
// 				pattern: RegExp(/(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source
// 					.replace(/<keyword>/g, function () { return keyword.source; })),
// 				lookbehind: true
// 			},
// 			// This is intended to capture the class name of method implementations like:
// 			//   void foo::bar() const {}
// 			// However! The `foo` in the above example could also be a namespace, so we only capture the class name if
// 			// it starts with an uppercase letter. This approximation should give decent results.
// 			/\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
// 			// This will capture the class name before destructors like:
// 			//   Foo::~Foo() {}
// 			/\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
// 			// This also intends to capture the class name of method implementations but here the class has template
// 			// parameters, so it can't be a namespace (until C++ adds generic namespaces).
// 			/\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/
// 		],
// 		'keyword': keyword,
// 		'number': {
// 			pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
// 			greedy: true
// 		},
// 		'operator': />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
// 		'boolean': /\b(?:false|true)\b/
// 	});

// 	Prism.languages.insertBefore("cpp2", 'string', {
// 		'module': {
// 			// https://en.cppreference.com/w/cpp/language/modules
// 			pattern: RegExp(
// 				/(\b(?:import|module)\s+)/.source +
// 				'(?:' +
// 				// header-name
// 				/"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source +
// 				'|' +
// 				// module name or partition or both
// 				/<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(/<mod-name>/g, function () { return modName; }) +
// 				')'
// 			),
// 			lookbehind: true,
// 			greedy: true,
// 			inside: {
// 				'string': /^[<"][\s\S]+/,
// 				'operator': /:/,
// 				'punctuation': /\./
// 			}
// 		},
// 		'raw-string': {
// 			pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
// 			alias: 'string',
// 			greedy: true
// 		}
// 	});

// 	Prism.languages.insertBefore('cpp2', 'keyword', {
// 		'generic-function': {
// 			pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
// 			inside: {
// 				'function': /^\w+/,
// 				'generic': {
// 					pattern: /<[\s\S]+/,
// 					alias: 'class-name',
// 					inside: Prism.languages.cpp
// 				}
// 			}
// 		}
// 	});

// 	Prism.languages.insertBefore('cpp2', 'operator', {
// 		'double-colon': {
// 			pattern: /::/,
// 			alias: 'punctuation'
// 		}
// 	});

// 	Prism.languages.insertBefore('cpp2', 'class-name', {
// 		// the base clause is an optional list of parent classes
// 		// https://en.cppreference.com/w/cpp/language/class
// 		'base-clause': {
// 			pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
// 			lookbehind: true,
// 			greedy: true,
// 			inside: Prism.languages.extend('cpp2', {})
// 		}
// 	});

// 	Prism.languages.insertBefore('inside', 'double-colon', {
// 		// All untokenized words that are not namespaces should be class names
// 		'class-name': /\b[a-z_]\w*\b(?!\s*::)/i
// 	}, Prism.languages.cpp['base-clause']);
// };

tokenizer2.apply();

Prism.languages.cpp = Prism.languages.extend('cpp', {
  'special': [
    /\b(?:D2D1_RECT_F|point3|vec3|color|ray|CAM_DESCRIPTOR|HRTCDevice|RTCDevice|HRTCScene|RTCScene|sphere|float3|RTCHit)\b/
  ]
});

module.exports = (opts) => {
  const marp = new Marp(opts);

  // Use custom highlight.js instance in Marp highlighter
  // The following is exactly same as https://github.com/marp-team/marp-core/blob/883e1d75ddf0bdf26a00cafd4f58d94a26fe4949/src/marp.ts#L92-L99
  marp.highlighter = (code, lang) => {
    if (lang) {
      // const tokens = Prism.tokenize(code, Prism.languages["cpp2"]);
      // tokens.forEach(token => {
      //   console.log(token.type);
      // });
      // Prism.tokenize().forEach(token => {
      //   Prism.highlight(token.toString());
      // })
      // console.log(Prism.highlight(code, Prism.languages.cpp, 'cpp'));
      // console.log(hljs.highlight("cpp", code, {}).value);
      return Prism.languages[lang]
        ? Prism.highlight(code, Prism.languages.cpp, 'cpp')
        : '';
    }
    return hljs.highlightAuto(code).value;
  }

  return marp;
}