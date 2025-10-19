export const getBaseUrl=()=>{
    if(import.meta.env.MODE=='development'){
        return 'http://localhost:3000';
    }
    else{
        return 'https://books-unbound-fshw.vercel.app'
    }
}