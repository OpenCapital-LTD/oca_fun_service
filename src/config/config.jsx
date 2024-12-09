const config = (key) => {
    console.log('HERE IS THE KEY LOOKING FOR',key)
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key]; 
      }
    
      return 'process.env[key]'; 
    };
    
  export {
      config
  }