
Synopsis

  $ quicktype [--lang LANG] [--out FILE] FILE|URL ...                           
                                                                                
  LANG ...                                                                      
  cs|go|rs|cr|c++|objc|java|ts|js|flow|swift|kotlin|elm|schema|ruby|dart|py|pike 

Description

  Given JSON sample data, quicktype outputs code for working with that data in  
  C#, Go, Rust, Crystal, C++, Objective-C, Java, TypeScript, JavaScript, Flow,  
  Swift, Kotlin (beta), Elm, JSON Schema, Ruby, Dart, Python, Pike.             

Options

 -o, --out FILE                                                                  The output file.          
                                                                                 Determines --lang and     
                                                                                 --top-level.              
 -t, --top-level NAME                                                            The name for the top      
                                                                                 level type.               
 -l, --lang                                                                      The target language.      
 cs|go|rs|cr|c++|objc|java|ts|js|flow|swift|kotlin|elm|schema|ruby|dart|py|pike                            
 -s, --src-lang json|schema|graphql|postman|typescript                           The source language       
                                                                                 (default is json).        
 --src FILE|URL|DIRECTORY                                                        The file, url, or data    
                                                                                 directory to type.        
 --src-urls FILE                                                                 Tracery grammar           
                                                                                 describing URLs to crawl. 
 --no-maps                                                                       Don't infer maps, always  
                                                                                 use classes.              
 --no-enums                                                                      Don't infer enums, always 
                                                                                 use strings.              
 --no-uuids                                                                      Don't convert UUIDs to    
                                                                                 UUID objects.             
 --no-date-times                                                                 Don't infer dates or      
                                                                                 times.                    
 --no-integer-strings                                                            Don't convert stringified 
                                                                                 integers to integers.     
 --no-boolean-strings                                                            Don't convert stringified 
                                                                                 booleans to booleans.     
 --no-combine-classes                                                            Don't combine similar     
                                                                                 classes.                  
 --no-ignore-json-refs                                                           Treat $ref as a reference 
                                                                                 in JSON.                  
 --graphql-schema FILE                                                           GraphQL introspection     
                                                                                 file.                     
 --graphql-introspect URL                                                        Introspect GraphQL schema 
                                                                                 from a server.            
 --http-method METHOD                                                            HTTP method to use for    
                                                                                 the GraphQL introspection 
                                                                                 query.                    
 --http-header HEADER                                                            Header(s) to attach to    
                                                                                 all HTTP requests,        
                                                                                 including the GraphQL     
                                                                                 introspection query.      
 -S, --additional-schema FILE                                                    Register the $id's of     
                                                                                 additional JSON Schema    
                                                                                 files.                    
 --alphabetize-properties                                                        Alphabetize order of      
                                                                                 class properties.         
 --all-properties-optional                                                       Make all class properties 
                                                                                 optional.                 
 --quiet                                                                         Don't show issues in the  
                                                                                 generated code.           
 --debug OPTIONS or all                                                          Comma separated debug     
                                                                                 options: print-graph,     
                                                                                 print-reconstitution,     
                                                                                 print-gather-names,       
                                                                                 print-transformations,    
                                                                                 print-schema-resolving,   
                                                                                 print-times, provenance   
 --telemetry enable|disable                                                      Enable anonymous          
                                                                                 telemetry to help improve 
                                                                                 quicktype                 
 -h, --help                                                                      Get some help.            
 -v, --version                                                                   Display the version of    
                                                                                 quicktype                 

Options for C#

 --namespace NAME                                  Generated namespace                                      
 --csharp-version 5|6                              C# version                                               
 --density normal|dense                            Property density                                         
 --array-type array|list                           Use T[] or List<T>                                       
 --number-type double|decimal                      Type to use for numbers                                  
 --features complete|attributes-only|just-types    Output features                                          
 --[no-]check-required                             Fail if required properties are missing (off by default) 
 --any-type object|dynamic                         Type to use for "any"                                    
 --base-class EntityData|Object                    Base class                                               

Options for Go

 --[no-]just-types                                 Plain types only (off by default)                       
 --package NAME                                    Generated package name                                  
 --[no-]multi-file-output                          Renders each top-level object in its own Go file (off   
                                                   by default)                                             

Options for Rust

 --density normal|dense                            Density                            
 --visibility private|crate|public                 Field visibility                   
 --[no-]derive-debug                               Derive Debug impl (off by default) 

Options for C++

 --[no-]just-types                                 Plain types only (off by default)                       
 --namespace NAME                                  Name of the generated namespace(s)                      
 --code-format with-struct|with-getter-setter      Generate classes with getters/setters, instead of       
                                                   structs                                                 
 --wstring use-string|use-wstring                  Store strings using Utf-16 std::wstring, rather than    
                                                   Utf-8 std::string                                       
 --msbuildPermissive not-permissive|use-           Moves to_json and from_json types into the              
 permissive                                        nlohmann::details namespace, so that msbuild can build  
                                                   it with conformance mode disabled                       
 --const-style west-const|east-const               Put const to the left/west (const T) or right/east (T   
                                                   const)                                                  
 --source-style single-source|multi-source         Source code generation type,  whether to generate       
                                                   single or multiple source files                         
 --include-location local-include|global-include   Whether json.hpp is to be located globally or locally   
 --type-style pascal-case|underscore-case|camel-   Naming style for types                                  
 case|upper-underscore-case|pascal-case-upper-                                                             
 acronyms|camel-case-upper-acronyms                                                                        
 --member-style underscore-case|pascal-            Naming style for members                                
 case|camel-case|upper-underscore-case|pascal-                                                             
 case-upper-acronyms|camel-case-upper-acronyms                                                             
 --enumerator-style upper-underscore-              Naming style for enumerators                            
 case|underscore-case|pascal-case|camel-                                                                   
 case|pascal-case-upper-acronyms|camel-case-                                                               
 upper-acronyms                                                                                            
 --enum-type NAME                                  Type of enum class                                      
 --[no-]boost                                      Require a dependency on boost. Without boost, C++17 is  
                                                   required (on by default)                                

Options for Objective-C

 --[no-]just-types                                 Plain types only (off by default)  
 --class-prefix PREFIX                             Class prefix                       
 --features all|interface|implementation           Interface and implementation       
 --[no-]extra-comments                             Extra comments (off by default)    
 --[no-]functions                                  C-style functions (off by default) 

Options for Java

 --package NAME                                    Generated package name            
 --[no-]just-types                                 Plain types only (off by default) 
 --acronym-style original|pascal|camel|lowerCase   Acronym naming style              
 --array-type array|list                           Use T[] or List<T>                

Options for TypeScript

 --[no-]just-types                                 Interfaces only (off by default)                        
 --[no-]nice-property-names                        Transform property names to be JavaScripty (off by      
                                                   default)                                                
 --[no-]explicit-unions                            Explicitly name unions (off by default)                 
 --[no-]runtime-typecheck                          Verify JSON.parse results at runtime (on by default)    
 --acronym-style original|pascal|camel|lowerCase   Acronym naming style                                    
 --converters top-level|all-objects                Which converters to generate (top-level by default)     

Options for JavaScript

 --[no-]runtime-typecheck                          Verify JSON.parse results at runtime (on by default) 
 --acronym-style original|pascal|camel|lowerCase   Acronym naming style                                 
 --converters top-level|all-objects                Which converters to generate (top-level by default)  

Options for Flow

 --[no-]just-types                                 Interfaces only (off by default)                        
 --[no-]nice-property-names                        Transform property names to be JavaScripty (off by      
                                                   default)                                                
 --[no-]explicit-unions                            Explicitly name unions (off by default)                 
 --[no-]runtime-typecheck                          Verify JSON.parse results at runtime (on by default)    
 --acronym-style original|pascal|camel|lowerCase   Acronym naming style                                    
 --converters top-level|all-objects                Which converters to generate (top-level by default)     

Options for Swift

 --[no-]just-types                                 Plain types only (off by default)                       
 --struct-or-class struct|class                    Structs or classes                                      
 --density dense|normal                            Code density                                            
 --[no-]initializers                               Generate initializers and mutators (on by default)      
 --[no-]coding-keys                                Explicit CodingKey values in Codable types (on by       
                                                   default)                                                
 --access-level internal|public                    Access level                                            
 --[no-]url-session                                URLSession task extensions (off by default)             
 --[no-]alamofire                                  Alamofire extensions (off by default)                   
 --[no-]support-linux                              Support Linux (off by default)                          
 --type-prefix PREFIX                              Prefix for type names                                   
 --protocol none|equatable|hashable                Make types implement protocol                           
 --acronym-style original|pascal|camel|lowerCase   Acronym naming style                                    
 --[no-]objective-c-support                        Objects inherit from NSObject and @objcMembers is added 
                                                   to classes (off by default)                             
 --[no-]swift-5-support                            Renders output in a Swift 5 compatible mode (off by     
                                                   default)                                                
 --[no-]multi-file-output                          Renders each top-level object in its own Swift file     
                                                   (off by default)                                        
 --[no-]mutable-properties                         Use var instead of let for object properties (off by    
                                                   default)                                                

Options for Kotlin (beta)

 --framework just-types|jackson|klaxon|kotlinx     Serialization framework 
 --package PACKAGE                                 Package                 

Options for Elm

 --[no-]just-types                                 Plain types only (off by default) 
 --module NAME                                     Generated module name             
 --array-type array|list                           Use Array or List                 

Options for Ruby

 --[no-]just-types                                 Plain types only (off by default) 
 --strictness strict|coercible|none                Type strictness                   

Options for Dart

 --[no-]just-types                                 Types only (off by default)                           
 --[no-]coders-in-class                            Put encoder & decoder in Class (off by default)       
 --[no-]from-map                                   Use method names fromMap() & toMap() (off by default) 
 --[no-]required-props                             Make all properties required (off by default)         
 --[no-]final-props                                Make all properties final (off by default)            
 --[no-]copy-with                                  Generate CopyWith method (off by default)             

Options for Python

 --python-version 2.7|3.5|3.6|3.7                  Python version                                          
 --[no-]just-types                                 Classes only (off by default)                           
 --[no-]nice-property-names                        Transform property names to be Pythonic (on by default) 

Examples

  Generate C# to parse a Bitcoin API                                            
  $ quicktype -o LatestBlock.cs https://blockchain.info/latestblock             
                                                                                
  Generate Go code from a directory of samples containing:                      
  - Foo.json                                                                    
  + Bar                                                                         
  - bar-sample-1.json                                                           
  - bar-sample-2.json                                                           
  - Baz.url                                                                     
  $ quicktype -l go samples                                                     
                                                                                
  Generate JSON Schema, then TypeScript                                         
  $ quicktype -o schema.json https://blockchain.info/latestblock                
  $ quicktype -o bitcoin.ts --src-lang schema schema.json                       

  Learn more at quicktype.io 

