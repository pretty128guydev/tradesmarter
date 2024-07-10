# Development process
* Develop URL scheme (navigation router)
* Initialize project:
    * √ setup typescript
    * (optional) setup code generation (create a generator for components to generate tests with code)
    * √ create API module: all trading data request to ajax module should return strictly typed responses, like Assets[]
    * √ setup redux store and dev environment (vagrant & local dev server)
    * √ Create a styleguide and dev documentation with project structure
* Development v1
    * Implement Layout
    * Components without complex logic:
        * Left sidebar
            * Videos, Signals, ...
        * Wallets
        * Sign in modal (design required)
        * Header
            * Logo, Links
        * √ Implement abstraction over lightstreamer
        * Assets modal
    * Components with complex logic:
        * Trading
        * Open positions
* Development 2
    * Implement chart component <-- main risk here: it is not that easy to copy and paste such big part of fxcfd
    * Implement a trading sentiment display
    * Mount widgets (bpw)
    * Support various game types <-- risk
* Development 3
    * Localization
        * Reuse old localization keys instead of texts in English
    * Support color themes
        * Implement a support in code via Provider API
        * Update backend to pass data from global config
        * Create adapter from old (fxcfd) format to react one
    * Handle errors
        * 'No feed'
        * 'Something went wrong'
* Additional work for optimization:
    * Create a seperate get-registry request on the backend to pass only a specific data (currently we pass more than we are going to use)